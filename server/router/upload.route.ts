import { Router } from "express";
import * as uploadController from "../controller/upload.controller"
import multer from "multer";
import * as CloudinaryHelper from "../helper/cloudinary.helper"

const upload = multer({ storage: CloudinaryHelper.storage });

const router = Router();

router.post(
  '/image',
  upload.single("file"),
  uploadController.imagePost
)

export default router;