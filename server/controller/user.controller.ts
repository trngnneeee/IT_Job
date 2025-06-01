import { Request, Response } from "express";
import UserAccount from "./../model/user-account.model"
import bcrypt from 'bcryptjs'

export const registerPost = async (req: Request, res: Response) => {
  const existAccount = await UserAccount.findOne({
    email: req.body.email
  });

  if (existAccount)
  {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  
  const newRecord = new UserAccount(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  });
}