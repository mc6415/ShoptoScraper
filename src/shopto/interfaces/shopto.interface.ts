import { Document } from 'mongoose';

export interface Shopto extends Document {
  readonly value: string; 
  readonly price: string;
  readonly dateUpdated: string;
}