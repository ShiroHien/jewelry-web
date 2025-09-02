import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  briefDescription: string;
  description: string;
  images: string[];
  category: string;
  tags: string[];
  details: Record<string, string>;
  price: number;
  availability: 'Available' | 'Sold Out';
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  briefDescription: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true, validate: [(val: string[]) => val.length <= 20, 'Cannot have more than 20 images.'] },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  details: { type: Map, of: String },
  price: { type: Number, required: true, default: 0 },
  availability: { type: String, enum: ['Available', 'Sold Out'], required: true, default: 'Available' }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);