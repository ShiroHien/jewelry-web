// This file extends the Express Request interface to include the `file` property from Multer.
// This is necessary for TypeScript to understand that `req.file` exists after the multer middleware runs.

declare namespace Express {
  export interface Request {
    file?: Multer.File;
  }
}
