import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import UserAccount from "../model/user-account.model";
import { AccountRequest } from "../interface/request.interface";
import CompanyAccount from "../model/company-account.model";

export const userVerifyToken = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không tồn tại!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await UserAccount.findOne({
      _id: id,
      email: email
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại trong hệ thống!"
      });
      return;
    }

    req.account = existAccount;

    next();
  }
  catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: error
    })
  }
}

export const companyVerifyToken = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không tồn tại!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await CompanyAccount.findOne({
      _id: id,
      email: email
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại trong hệ thống!"
      });
      return;
    }

    req.account = existAccount;

    next();
  }
  catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: error
    })
  }
}