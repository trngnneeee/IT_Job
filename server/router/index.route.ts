import express from "express";
import userRouter from "./user.route"
import authRouter from "./auth.route"
import companyRouter from "./company.route"
import cityRouter from "./city.route"

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

router.use(
  "/city",
  cityRouter
)

export default router;