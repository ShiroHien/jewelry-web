import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.middleware';
import { uploadImage } from '../controllers/upload.controller';

const router = express.Router();

// Set up multer for file storage in memory
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    fileFilter: function (req: Request, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
});

router.post('/', protect, upload.single('image'), uploadImage);

export default router;