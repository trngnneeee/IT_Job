import { Router } from "express";
import * as authController from "../controller/auth.controller"

const router = Router();

router.get(
  '/check',
  authController.checkGet
)

export default router;