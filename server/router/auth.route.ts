import { Router } from "express";
import * as authController from "../controller/auth.controller"

const router = Router();

router.get(
  '/check',
  authController.checkGet
)

router.get(
  '/logout',
  authController.logoutGet
)

export default router;