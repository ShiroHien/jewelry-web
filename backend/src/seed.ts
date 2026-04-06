import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/user.model';
import connectDB from './config/db';

dotenv.config();

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Please provide ADMIN_EMAIL (or ADMIN_USERNAME) and ADMIN_PASSWORD in your .env file');
            return;
        }

        const normalizedAdminEmail = adminEmail.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Backward compatibility: some existing databases still have a unique `username` index.
        // Seed through the raw collection so we can set both fields and avoid duplicate null usernames.
        const existingAdmin = await User.collection.findOne({
            $or: [
                { email: normalizedAdminEmail },
                { username: normalizedAdminEmail },
            ],
        });

        if (existingAdmin?._id) {
            await User.collection.updateOne(
                { _id: existingAdmin._id },
                {
                    $set: {
                        email: normalizedAdminEmail,
                        username: normalizedAdminEmail,
                        password: hashedPassword,
                        role: 'admin',
                    },
                },
            );
            console.log('Admin user password updated.');
            return;
        }

        await User.collection.insertOne({
            email: normalizedAdminEmail,
            username: normalizedAdminEmail,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user created successfully.');

    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

const runSeedScript = async () => {
    try {
        await connectDB();
        await seedAdmin();
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

// Only disconnect if run directly (not imported)
if (require.main === module) {
    runSeedScript().catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1);
    });
}

export default seedAdmin;
