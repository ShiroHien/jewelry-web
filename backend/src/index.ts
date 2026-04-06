import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});