import { Router } from "express";
import * as userController from "../controller/user.controller";
import * as userValidate from "./../validate/user.validate"

const router = Router();

router.post(
  '/register', 
  userValidate.registerPost,
  userController.registerPost
)

export default router;