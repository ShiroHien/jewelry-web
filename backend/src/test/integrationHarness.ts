import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/user.model';

let mongoServer: MongoMemoryServer;

export const setupIntegrationHarness = () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'integration-test-secret';
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

export const createUserAndToken = async (role: 'admin' | 'user') => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET must be set in integration tests.');
  }

  const user = await User.create({
    email: `integration-${role}-${Date.now()}@example.com`,
    password: 'Password123!',
    role,
  });

  return jwt.sign({ userId: String(user._id), role: user.role }, jwtSecret, { expiresIn: '1h' });
};

export const getAdminToken = async () => {
  return createUserAndToken('admin');
};

export const getUserToken = async () => {
  return createUserAndToken('user');
};

export const api = () => request(app);