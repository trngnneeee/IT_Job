import { Router } from "express";
import * as userController from "../controller/user.controller";
import * as userValidate from "./../validate/user.validate"
import * as userMiddleware from "../middleware/auth.middleware"

import multer from "multer"
import { storage } from "../helper/cloudinary.helper"

const router = Router();

const upload = multer({ storage: storage })

router.post(
  '/register',
  userValidate.registerPost,
  userController.registerPost
)

router.post(
  '/login',
  userValidate.loginPost,
  userController.loginPost
)

router.patch(
  '/profile',
  userMiddleware.userVerifyToken,
  upload.single('avatar'),
  userController.profilePatch
)

export default router;