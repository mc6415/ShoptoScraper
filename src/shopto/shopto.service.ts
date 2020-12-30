import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Shopto } from './interfaces/shopto.interface'
import { CreateShoptoDTO } from './dto/create-shopto.dto'

@Injectable()
export class ShoptoService {
  constructor(@InjectModel('Shopto') private readonly shoptoModel: Model<Shopto>) { }

  async addPrice(createShoptoDTO: CreateShoptoDTO): Promise<Shopto> {
    const newPrice = await new this.shoptoModel(createShoptoDTO);

    console.log(newPrice);
    return newPrice.save();
  }
}
