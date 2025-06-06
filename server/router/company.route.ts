import { Router } from "express";
import * as companyController from "../controller/company.controller";
import * as companyValidate from "../validate/company.validate"
import * as companyMiddleware from "../middleware/auth.middleware"
import multer from "multer";
import { storage } from "../helper/cloudinary.helper";

const router = Router();
const upload = multer({ storage: storage });

router.post(
  '/register',
  companyValidate.registerPost,
  companyController.registerPost
)

router.post(
  '/login',
  companyValidate.loginPost,
  companyController.loginPost
)

router.patch(
  '/profile',
  companyMiddleware.companyVerifyToken,
  upload.single('logo'),
  companyController.profilePatch
)

export default router;