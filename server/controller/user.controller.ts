import { Request, Response } from "express";
import UserAccount from "./../model/user-account.model"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { AccountRequest } from "../interface/request.interface";
import CV from "../model/cv.model";
import CompanyJob from "../model/company-job.model";
import CompanyAccount from "../model/company-account.model";

export const registerPost = async (req: Request, res: Response) => {
  const existAccount = await UserAccount.findOne({
    email: req.body.email
  });

  if (existAccount) {
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

export const loginPost = async (req: Request, res: Response) => {
  const existAccount = await UserAccount.findOne({
    email: req.body.email
  })
  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  }

  const isValidPassword = await bcrypt.compare(req.body.password, `${existAccount.password}`);
  if (!isValidPassword) {
    res.json({
      code: "error",
      message: "Mật khẩu không chính xác!"
    });
    return;
  }

  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: '1d'
    }
  );

  // Lưu token vào cookie cả bên FE và BE
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,  // false: http, true: https
    sameSite: "lax" // Cho phép gửi cookie giữa các domain
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!"
  });
}

export const profilePatch = async (req: AccountRequest, res: Response) => {
  if (req.file) {
    req.body.avatar = req.file.path;
  }
  else {
    delete req.body.avatar;
  }

  await UserAccount.updateOne({
    _id: req.account.id,
    email: req.body.email
  }, req.body);

  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  })
}

export const cvListGet = async (req: AccountRequest, res: Response) => {
  const email = req.account.email;

  const CVList = [];
  const rawCVList = await CV.find({
    email: email
  }).sort({
    createdAt: "desc"
  })

  for (const item of rawCVList) {
    const tmp = {
      id: item.id,
      title: "",
      companyName: "",
      salaryMin: 0,
      salaryMax: 0,
      level: "",
      workingForm: "",
      status: item.status,
      fileCV: item.fileCV
    };

    const jobDetail = await CompanyJob.findOne({
      _id: item.jobId
    });

    if (jobDetail) {
      tmp.title = `${jobDetail.title}`;
      tmp.salaryMin = parseInt(`${jobDetail.salaryMin}`);
      tmp.salaryMax = parseInt(`${jobDetail.salaryMax}`);
      tmp.level = `${jobDetail.level}`;
      tmp.workingForm = `${jobDetail.workingForm}`;
    }

    const companyDetail = await CompanyAccount.findOne({
      _id: jobDetail?.companyId
    });
    if (companyDetail) tmp.companyName = `${companyDetail.companyName}`;

    CVList.push(tmp);
  }

  res.json({
    code: "success",
    message: "Lấy dữ liệu thành công!",
    CVList: CVList
  })
}

export const cvDelete = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const infoCV = await CV.findOne({
      _id: id
    });

    if (!infoCV) {
      res.json({
        code: "error",
        message: "ID không hợp lệ!"
      });
      return;
    }

    await CV.deleteOne({
      _id: id
    })

    res.json({
      code: "success",
      message: "Xóa thành công!"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}