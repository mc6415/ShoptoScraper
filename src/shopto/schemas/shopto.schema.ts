import * as mongoose from 'mongoose';

export const ShoptoSchema = new mongoose.Schema({
  price: String,
  value: String,
  dateUpdated: String,
})