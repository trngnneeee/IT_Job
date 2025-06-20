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

router.post(
  "/job/create",
  companyMiddleware.companyVerifyToken,
  upload.array("images"),
  companyController.jobCreatePost
)

router.get(
  "/job/list",
  companyMiddleware.companyVerifyToken,
  companyController.listGet
)

router.get(
  "/job/edit/:id",
  companyMiddleware.companyVerifyToken,
  companyController.editGet
)

router.patch(
  "/job/edit/:id",
  companyMiddleware.companyVerifyToken,
  upload.array("images"),
  companyController.editPost
)

router.delete(
  "/job/delete/:id",
  companyMiddleware.companyVerifyToken,
  companyController.jobDelete
)

router.get(
  "/list",
  companyController.searchGet
)

router.get(
  "/detail/:id",
  companyController.companyDetailGet
)

router.get(
  "/cv/list",
  companyMiddleware.companyVerifyToken,
  companyController.cvListGet
)

router.get(
  "/cv/detail/:id",
  companyMiddleware.companyVerifyToken,
  companyController.cvDetailGet
)

router.patch(
  "/cv/change-status",
  companyMiddleware.companyVerifyToken,
  companyController.cvChangeStatusPatch
)

router.delete(
  "/cv/delete/:id",
  companyMiddleware.companyVerifyToken,
  companyController.cvDelete
)

export default router;