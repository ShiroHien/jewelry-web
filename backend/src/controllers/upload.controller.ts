import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Convert buffer to data URI for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary from data URI
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'klora_jewelry',
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error: any) {
    // Log the detailed error to the backend console
    console.error('Cloudinary upload error:', error);
    
    // Send a more informative error message to the frontend
    res.status(500).json({ 
        message: 'Error uploading image.',
        error: error.message || 'An unknown error occurred'
    });
  }
};