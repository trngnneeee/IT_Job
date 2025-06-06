import { Router } from "express";
import * as companyController from "../controller/company.controller";
import * as companyValidate from "../validate/company.validate"

const router = Router();

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

router.post(
  '/profile',
  companyController.profilePost
)

export default router;