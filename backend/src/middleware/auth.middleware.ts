import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

interface JwtPayload {
  userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, JWT_SECRET) as JwtPayload;
            return next();
        } catch (error) {
            console.error('Token verification failed', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};