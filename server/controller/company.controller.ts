import { Request, Response } from "express";
import CompanyAccount from "../model/company-account.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AccountRequest } from "../interface/request.interface";
import CompanyJob from "../model/company-job.model";
import { title } from "process";
import Cities from "../model/city.model";
import CV from "../model/cv.model";

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
  try {
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
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const searchGet = async (req: Request, res: Response) => {
  let limitItem = 9;
  if (req.query.limitItem) {
    limitItem = parseInt(`${req.query.limitItem}`);
  }

  const find = {};

  const totalRecord = await CompanyAccount.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  let page = 1;
  if (req.query.page) {
    const tmp = parseInt(`${req.query.page}`);
    if (tmp > 0) page = tmp;
  }
  if (totalPage != 0 && page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItem;

  const companyRawList = await CompanyAccount.find(find).limit(limitItem).skip(skip);

  const companyList = [];
  for (const item of companyRawList) {
    const tmp = {
      id: item.id,
      companyName: item.companyName,
      logo: item.logo,
      cityName: "",
      totalJob: 0
    };

    const cityInfo = await Cities.findOne({
      _id: item.city
    })
    tmp.totalJob = await CompanyJob.countDocuments({
      companyId: item.id
    })
    companyList.push(tmp);
  }

  res.json({
    code: "success",
    message: "Lấy dữ liệu thành công!",
    companyList: companyList,
    totalPage: totalPage
  })
}

export const companyDetailGet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const rawCompanyDetail = await CompanyAccount.findOne({
      _id: id
    });

    const companyDetail = {
      companyName: rawCompanyDetail?.companyName,
      address: rawCompanyDetail?.address,
      companyModel: rawCompanyDetail?.companyModel,
      companyEmployees: rawCompanyDetail?.companyEmployees,
      workingTime: rawCompanyDetail?.workingTime,
      WorkOvertime: rawCompanyDetail?.WorkOvertime,
      description: rawCompanyDetail?.description,
    }

    const rawJobList = await CompanyJob.find({
      companyId: rawCompanyDetail?.id
    });

    const city = await Cities.findOne({
      _id: rawCompanyDetail?.city
    });

    const jobList = [];
    for (const job of rawJobList) {
      jobList.push({
        id: job.id,
        title: job.title,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        level: job.level,
        workingForm: job.workingForm,
        technologies: job.technologies,
        logo: rawCompanyDetail?.logo,
        city: city?.name
      })
    }

    res.json({
      code: "success",
      message: "Lấy dữ liệu thành công!",
      companyDetail: companyDetail,
      jobList: jobList
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const cvListGet = async (req: AccountRequest, res: Response) => {
  const jobList = await CompanyJob.find({
    companyId: req.account.id
  });
  const jobIDList = jobList.map((item) => item.id);

  const CVList = [];
  const rawCVList = await CV.find({
    jobId: { $in: jobIDList }
  }).sort({
    createdAt: "desc"
  })

  for (const item of rawCVList) {
    const tmp = {
      id: item.id,
      title: "",
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      salaryMin: 0,
      salaryMax: 0,
      level: "",
      workingForm: "",
      viewed: item.viewed,
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

    CVList.push(tmp);
  }

  res.json({
    code: "success",
    message: "Lấy dữ liệu thành công!",
    CVList: CVList
  })
}

export const cvDetailGet = async (req: AccountRequest, res: Response) => {
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

    const rawJobDetail = await CompanyJob.findOne({
      _id: infoCV.jobId,
      companyId: req.account.id
    });
    if (!rawJobDetail) {
      res.json({
        code: "error",
        message: "Bạn không có quyền truy cập!"
      });
      return;
    }

    const cvDetail = {
      fullName: infoCV.fullName,
      email: infoCV.email,
      phone: infoCV.phone,
      fileCV: infoCV.fileCV,
    }

    const jobDetail = {
      id: rawJobDetail.id,
      title: rawJobDetail.title,
      salaryMin: rawJobDetail.salaryMin,
      salaryMax: rawJobDetail.salaryMax,
      level: rawJobDetail.level,
      workingForm: rawJobDetail.workingForm,
      technologies: rawJobDetail.technologies,
    }

    await CV.updateOne({
      _id: id
    }, {
      viewed: true
    })

    res.json({
      code: "success",
      message: "Lấy dữ liệu thành công!",
      cvDetail: cvDetail,
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

export const cvChangeStatusPatch = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.body.id;
    const status = req.body.status;

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

    const rawJobDetail = await CompanyJob.findOne({
      _id: infoCV.jobId,
      companyId: req.account.id
    });
    if (!rawJobDetail) {
      res.json({
        code: "error",
        message: "Bạn không có quyền truy cập!"
      });
      return;
    }

    await CV.updateOne({
      _id: id
    }, {
      status: status
    })

    res.json({
      code: "success",
      message: "Cập nhật thành công!"
    })
  }
  catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
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

    const rawJobDetail = await CompanyJob.findOne({
      _id: infoCV.jobId,
      companyId: req.account.id
    });
    if (!rawJobDetail) {
      res.json({
        code: "error",
        message: "Bạn không có quyền truy cập!"
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