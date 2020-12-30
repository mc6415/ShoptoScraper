import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ShoptoSchema } from "./schemas/shopto.schema" 
import { ShoptoService } from './shopto.service';
import { ShoptoController } from './shopto.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Shopto', schema: ShoptoSchema }]),
  ],
  providers: [ShoptoService],
  controllers: [ShoptoController]
})
export class ShoptoModule {}
