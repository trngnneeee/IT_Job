import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import UserAccount from "../model/user-account.model";
import CompanyAccount from "../model/company-account.model";

export const checkGet = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    // Tìm user
    const existAccount = await UserAccount.findOne({
      email: email,
      _id: id
    });

    if (existAccount) {
      const infoUser = {
        id: existAccount.id,
        fullName: existAccount.fullName,
        email: existAccount.email,
        phone: existAccount.phone,
        avatar: existAccount.avatar
      };

      res.json({
        code: "success",
        message: "Kiểm tra Cookies thành công!",
        infoUser: infoUser
      });
      return;
    }

    // Tìm company
    const existCompanyAccount = await CompanyAccount.findOne({
      email: email,
      _id: id
    });
    if (existCompanyAccount) {
      const infoCompany = {
        id: existCompanyAccount.id,
        fullName: existCompanyAccount.companyName,
        email: existCompanyAccount.email
      };

      res.json({
        code: "success",
        message: "Kiểm tra Cookies thành công!",
        infoCompany: infoCompany
      });
      return;
    }

  }
  catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    });
  }
}

export const logoutGet = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  });
}