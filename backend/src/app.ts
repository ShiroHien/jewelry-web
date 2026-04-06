import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import blogRoutes from './routes/blog.routes';
import uploadRoutes from './routes/upload.routes';

const app: Express = express();
const isTestEnv = process.env.NODE_ENV === 'test';

const getAllowedOrigins = (): string[] => {
  const rawOrigins = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173';
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without Origin (curl, server-to-server, health checks).
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = getAllowedOrigins();
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload attempts, please try again later.' },
});

if (!isTestEnv) {
  app.use('/api', generalLimiter);
}

const authProtectionMiddleware = isTestEnv ? [] : [authLimiter];
const uploadProtectionMiddleware = isTestEnv ? [] : [uploadLimiter];

app.use('/api/auth', ...authProtectionMiddleware, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', ...uploadProtectionMiddleware, uploadRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('KLORA Jewelry Backend is running!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  if (err.message === 'CORS origin not allowed') {
    return res.status(403).json({ message: err.message });
  }

  if (err.message === 'File too large') {
    return res.status(413).json({ message: 'File too large. Max upload size is 5MB.' });
  }

  return res.status(400).json({ message: err.message });
});

export default app;