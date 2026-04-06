import dotenv from 'dotenv';
import connectDB from './config/db';
import seedAdmin from './seed'; // Add this import
import app from './app';

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB().then(() => {
  seedAdmin(); // Run the seed script
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});