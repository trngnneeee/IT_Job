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
  if (req.file) {
    req.body.logo = req.file.path;
  }
  else {
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
  if (req.files) {
    for (const file of req.files as any[]) {
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
  const find = {
    companyId: req.account.id
  };

  let limit = 2;
  const totalRecord = await CompanyJob.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limit);

  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(`${req.query.page}`);
    if (tmp > 0) page = tmp;
  }

  if (totalPage != 0 && page > totalPage) {
    page = totalPage;
  }
  const skip = (page - 1) * limit;

  const jobRawList = await CompanyJob.find(find).limit(limit).skip(skip);
  const jobList = [];
  for (const item of jobRawList) {
    const city = await Cities.findOne({
      _id: req.account.city
    })
    jobList.push({
      id: item.id,
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
    jobList: jobList,
    totalPage: totalPage
  })
}

export const editGet = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;
    const jobRawDetail = await CompanyJob.findOne({
      _id: id,
      companyId: req.account.id
    })

    if (!jobRawDetail) {
      res.json({
        code: "error",
        message: "ID không hợp lệ!"
      });
      return;
    }

    const jobDetail = {
      title: jobRawDetail?.title,
      salaryMin: jobRawDetail?.salaryMin,
      salaryMax: jobRawDetail?.salaryMax,
      level: jobRawDetail?.level,
      workingForm: jobRawDetail?.workingForm,
      technologies: jobRawDetail?.technologies,
      images: jobRawDetail?.images,
      description: jobRawDetail?.description,
    };
    res.json({
      code: "success",
      message: "Lấy dữ liệu thành công!",
      jobDetail: jobDetail
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const editPost = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;

    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];

    req.body.images = [];
    if (req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }

    req.body.updatedBy = req.account.id;
    req.body.updatedAt = req.account.id;

    await CompanyJob.updateOne({
      _id: id
    }, req.body)

    res.json({
      code: "success",
      message: "Chỉnh sửa thành công!"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const jobDelete = async (req: AccountRequest, res: Response) => {
  try
  {
    const id = req.params.id;
    await CompanyJob.deleteOne({
      _id: id,
      companyId: req.account.id
    });
    res.json({
      code: "success",
      message: "Xóa công việc thành công"
    });
  }
  catch(error)
  {
    res.json({
      code: "error",
      message: error
    })
  }
}