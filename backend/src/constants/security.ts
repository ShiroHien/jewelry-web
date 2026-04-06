export const DEFAULT_ALLOWED_ORIGINS = 'http://localhost:5173';

export const REQUEST_BODY_LIMIT = '100kb';

export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export const RATE_LIMIT_MAX = {
  general: 300,
  auth: 20,
  upload: 30,
} as const;

export const MAX_UPLOAD_SIZE_IN_BYTES = 5 * 1024 * 1024;

export const ERROR_MESSAGES = {
  corsOriginNotAllowed: 'CORS origin not allowed',
  tooManyRequests: 'Too many requests, please try again later.',
  tooManyLoginAttempts: 'Too many login attempts, please try again later.',
  tooManyUploadAttempts: 'Too many upload attempts, please try again later.',
  fileTooLarge: 'File too large. Max upload size is 5MB.',
  unsupportedUploadType: 'Error: File upload only supports the following filetypes - /jpeg|jpg|png|gif/',
} as const;