import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import connectDB from './config/db';

dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            console.error('Please provide ADMIN_USERNAME and ADMIN_PASSWORD in your .env file');
            (process as any).exit(1);
        }

        const adminExists = await User.findOne({ username: adminUsername });

        if (adminExists) {
            console.log('Admin user already exists.');
            return;
        }

        const admin = new User({
            username: adminUsername,
            password: adminPassword,
        });

        await admin.save();
        console.log('Admin user created successfully.');

    } catch (error) {
        console.error('Error seeding admin user:', error);
        (process as any).exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedAdmin();
