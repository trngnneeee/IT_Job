import { Router } from "express";
import * as jobController from "../controller/job.controller"
import * as jobValidate from "./../validate/job.validate"

import multer from "multer";
import * as CloudinaryHelper from "./../helper/cloudinary.helper"
const upload = multer({ 
  storage: CloudinaryHelper.storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype != "application/pdf") 
    {
      cb(null, false);
      return;
    }
    cb(null, true);
  }
})

const router = Router();

router.get(
  '/detail/:id',
  jobController.detailGet
)

router.post(
  "/apply",
  upload.single("fileCV"),
  jobValidate.applyPost,
  jobController.applyPost
)

export default router;