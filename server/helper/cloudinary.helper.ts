import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: 'dnqinxiwo', 
  api_key: '589421284786958', 
  api_secret: process.env.CLOUDINARY_SECRET_API
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary
})