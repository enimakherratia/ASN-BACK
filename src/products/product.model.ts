import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  prices: { type: [Number], required: true },
  rate: { type: Number, required: true },
  category: { type: String, enum: ['product', 'equipment'], required: true },
});

export interface Product extends Document {
  id: string;
  name: string;
  updated_at: Date;
  prices: number[];
  rate: number;
  category: 'product' | 'equipment';
}
