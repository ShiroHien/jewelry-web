import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { API_BASE_PATH } from './constants/routes';
import {
  DEFAULT_ALLOWED_ORIGINS,
  ERROR_MESSAGES,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_BODY_LIMIT,
} from './constants/security';
import { registerApiRoutes } from './routes';

const app: Express = express();
const isTestEnv = process.env.NODE_ENV === 'test';

const getAllowedOrigins = (): string[] => {
  const rawOrigins = process.env.CORS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS;
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

    return callback(new Error(ERROR_MESSAGES.corsOriginNotAllowed));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX.general,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: ERROR_MESSAGES.tooManyRequests },
});

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX.auth,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: ERROR_MESSAGES.tooManyLoginAttempts },
});

const uploadLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX.upload,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: ERROR_MESSAGES.tooManyUploadAttempts },
});

if (!isTestEnv) {
  app.use(API_BASE_PATH, generalLimiter);
}

const authProtectionMiddleware = isTestEnv ? [] : [authLimiter];
const uploadProtectionMiddleware = isTestEnv ? [] : [uploadLimiter];

registerApiRoutes(app, {
  auth: authProtectionMiddleware,
  upload: uploadProtectionMiddleware,
});

app.get('/', (req: Request, res: Response) => {
  res.send('KLORA Jewelry Backend is running!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  if (err.message === ERROR_MESSAGES.corsOriginNotAllowed) {
    return res.status(403).json({ message: err.message });
  }

  if (err.message === 'File too large') {
    return res.status(413).json({ message: ERROR_MESSAGES.fileTooLarge });
  }

  return res.status(400).json({ message: err.message });
});

export default app;