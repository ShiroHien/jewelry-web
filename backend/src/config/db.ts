import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      // Throw an error to stop execution and satisfy TypeScript's control flow analysis
      throw new Error('MongoDB URI not found in .env file.');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('Error connecting to MongoDB:', err.message);
    // Exit process with failure
    (process as any).exit(1);
  }
};

export default connectDB;
