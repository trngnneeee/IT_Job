import express from "express";
import userRouter from "./user.route"
import authRouter from "./auth.route"
import companyRouter from "./company.route"

const router = express.Router();

router.use(
  "/user", 
  userRouter
);

router.use(
  "/auth",
  authRouter
)

router.use(
  "/company",
  companyRouter
)

export default router;