import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  author: string;
  date: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);