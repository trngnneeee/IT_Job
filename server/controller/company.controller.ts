import { Request, Response } from "express";
import CompanyAccount from "../model/company-account.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AccountRequest } from "../interface/request.interface";
import CompanyJob from "../model/company-job.model";
import { title } from "process";
import Cities from "../model/city.model";

export const registerPost = async (req: Request, res: Response) => {
  const existAccount = await CompanyAccount.findOne({
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

  const newRecord = new CompanyAccount(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  });
}

export const loginPost = async (req: Request, res: Response) => {
  const existAccount = await CompanyAccount.findOne({
    email: req.body.email
  });

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

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,  
    sameSite: "lax" 
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!"
  })
}

export const profilePatch = async (req: AccountRequest, res: Response) => {
  if (req.file)
  {
    req.body.logo = req.file.path;
  }
  else
  {
    delete req.body.logo;
  }

  await CompanyAccount.updateOne({
    _id: req.account.id
  }, req.body)
  
  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  })
}

export const jobCreatePost = async (req: AccountRequest, res: Response) => {
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = [];
  if (req.files)
  {
    for (const file of req.files as any[])
    {
      req.body.images.push(file.path);
    }
  }

  const newRecord = new CompanyJob(req.body);
  await newRecord.save();
  
  res.json({
    code: "success",
    message: "Tạo công việc thành công!"
  })
}

export const listGet = async (req: AccountRequest, res: Response) => {
  const jobRawList = await CompanyJob.find({
    companyId: req.account.id
  });
  const jobList = [];
  for (const item of jobRawList)
  {
    const city = await Cities.findOne({
      _id: req.account.city
    })
    jobList.push({
      title: item.title,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      level: item.level,
      workingForm: item.workingForm,
      technologies: item.technologies,
      description: item.description,
      images: item.images,
      company: req.account.companyName,
      logo: req.account.logo,
      city: city?.name
    })
  }
  
  res.json({
    code: "success",
    message: "Lấy dữ liệu thành công!",
    jobList: jobList
  })
}