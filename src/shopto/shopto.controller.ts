/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ShoptoService } from './shopto.service';
import { CreateShoptoDTO } from './dto/create-shopto.dto';
import axios from 'axios';
const cheerio = require("cheerio");
import { createWorker } from 'tesseract.js'
const { PNG } = require("pngjs");
import * as fs from 'fs';
import { Shopto } from './interfaces/shopto.interface';

interface Item { 
  value: string,
  priceImgSrc: string
}

@Controller('shopto')
export class ShoptoController {
  constructor(private shoptoService: ShoptoService) { }

  @Get('/test')
  async test(@Res() res) {
    const test = {
      price: '20',
      value: '22',
      dateUpdated: new Date().toISOString()
    }    

    const newstuff = await this.shoptoService.addPrice(test);
    return res.status(HttpStatus.OK);
  }

  @Get('/scrape')
  async scrape() {
    await this.getShopto();

    return "test";
  }

  async getPriceImage(src) {
    const b64 = src.replace(/^data:image\/png;base64,/, "");
    const data = Buffer.from(b64, "base64");

    try {
      await fs.promises.writeFile("out.png", data, "base64");
      console.log("writing image", new Date().toISOString());
    } catch (err) {
      throw(err);
    }
  }

  async convertImage() {
    console.log("converting", new Date().toISOString());

    const file = await fs.promises.readFile("out.png");
    const png = PNG.sync.read(file);
    const options = {
      colorType: 2,
      bgColor: {
        red: 255,
        blue: 255,
        green: 255,
      }
    }

    const buffer = PNG.sync.write(png, options);
    await fs.promises.writeFile("test.png", buffer);
  }

  async readImage() {
    console.log("reading image", new Date().toISOString());

    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data: { text } } = await worker.recognize("test.png");
    await worker.terminate();
    return text;
  }

  async processItem(item: Item) {
    return new Promise(async (resolve) => {
      await this.getPriceImage(item.priceImgSrc).then(res => {
        console.log("got image", new Date().toISOString());
      })
      await this.convertImage().then(res => {
        console.log("converted image", new Date().toISOString());
      })
      await this.readImage().then(async (res) => {
        console.log("Read image", new Date().toISOString());
        console.log(`Value: £${item.value}, Price: ${res}`);
        const dbItem = {
          price: res.replace("£", "").trim(),
          value: item.value,
          dateUpdated: new Date().toISOString()
        }

        const newItem = await this.shoptoService.addPrice(dbItem);
        fs.unlinkSync("out.png");
        fs.unlinkSync("test.png");
      })

      return resolve(1);
    });
  }

  async beginScrape(items: Array<Item>) {
    for (const item of items) {
      await this.processItem(item);
    }
  }

  async getShopto() {
    try {
      const { data } = await axios.get("https://www.shopto.net/en/sony-wallet-topup/");

      const $ = cheerio.load(data);
      const items: Array<Item> = [];
      $(".itemlist__info").each((i, el) => {
        const priceImgSrc = $(el).find(".base_price > img").attr("src");

        const text = $(el).text().trim();
        const value = text.substring(text.indexOf("£") + 1).split(" ")[0];

        items.push( { value , priceImgSrc });
      })

      await this.beginScrape(items);
    } catch (err) {
      throw(err);
    }
  }
}
