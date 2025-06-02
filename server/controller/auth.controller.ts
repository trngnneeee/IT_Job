import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import UserAccount from "../model/user-account.model";

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

    const existAccount = await UserAccount.findOne({
      email: email,
      _id: id
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Email không tồn tại trong hệ thống!"
      });
      return;
    }

    const infoUser = {
      id: existAccount.id,
      fullName: existAccount.fullName,
      email: existAccount.email
    };

    res.json({
      code: "success",
      message: "Kiểm tra Cookies thành công!",
      infoUser: infoUser
    })
  }
  catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    });
  }
}