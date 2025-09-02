import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import blogRoutes from './routes/blog.routes';
import uploadRoutes from './routes/upload.routes';
import seedAdmin from './seed'; // Add this import

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB().then(() => {
  seedAdmin(); // Run the seed script
});

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['https://klora-jewelry.vercel.app/', 'http://localhost:5173'], // add your Vercel domain
  credentials: true,
})); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);


// A simple test route to make sure the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('KLORA Jewelry Backend is running!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});