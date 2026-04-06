import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
    }

    return secret;
};

interface JwtPayload {
  userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const JWT_SECRET = getJwtSecret();

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            const user = await User.findById(decoded.userId).select('email role');
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = {
                _id: String(user._id),
                email: user.email,
                role: user.role,
            };

            return next();
        } catch (error) {
            console.error('Token verification failed', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: admin access required' });
    }

    return next();
};