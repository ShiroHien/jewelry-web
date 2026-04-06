import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { protect, requireAdmin } from '../middleware/auth.middleware';
import { uploadImage } from '../controllers/upload.controller';
import { ERROR_MESSAGES, MAX_UPLOAD_SIZE_IN_BYTES } from '../constants/security';

const router = express.Router();

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const allowedImageTypes = /jpeg|jpg|png|gif/;

const upload = multer({ 
    storage,
    limits: {
        fileSize: MAX_UPLOAD_SIZE_IN_BYTES,
    },
    fileFilter: function (req: Request, file, cb) {
        const mimetype = allowedImageTypes.test(file.mimetype);
        const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error(ERROR_MESSAGES.unsupportedUploadType));
    }
});

router.post('/', protect, requireAdmin, upload.single('image'), uploadImage);

export default router;