import { Router } from "express";
import * as userController from "../controller/user.controller";

const router = Router();

router.post(
  '/register', 
  userController.registerPost
)

export default router;