import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import connectDB from './config/db';

dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Please provide ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
            (process as any).exit(1);
        }

        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            adminExists.password = adminPassword;
            await adminExists.save();
            console.log('Admin user password updated.');
            return;
        }

        const admin = new User({
            email: adminEmail,
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
