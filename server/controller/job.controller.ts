import { Request, Response } from "express";
import CompanyJob from "../model/company-job.model";
import CompanyAccount from "../model/company-account.model";
import CV from "../model/cv.model";

export const detailGet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const jobRawDetail = await CompanyJob.findOne({
      _id: id
    })
    const jobDetail = {
      id: jobRawDetail?.id,
      companyId: jobRawDetail?.id,
      title: jobRawDetail?.title,
      companyName: "",
      salaryMin: jobRawDetail?.salaryMin,
      salaryMax: jobRawDetail?.salaryMax,
      images: jobRawDetail?.images,
      level: jobRawDetail?.level,
      workingForm: jobRawDetail?.workingForm,
      address: "",
      technologies: jobRawDetail?.technologies,
      description: jobRawDetail?.description,
      companyLogo: "",
      companyModel: "",
      companyEmployees: "",
      workingTime: "",
      WorkOvertime: "",
    }

    const companyInfo = await CompanyAccount.findOne({
      _id: jobRawDetail?.companyId
    });

    if (companyInfo)
    {
      jobDetail.companyName = `${companyInfo.companyName}`;
      jobDetail.address = `${companyInfo.address}`;
      jobDetail.companyLogo = `${companyInfo.logo}`;
      jobDetail.companyModel = `${companyInfo.companyModel}`;
      jobDetail.companyEmployees = `${companyInfo.companyEmployees}`;
      jobDetail.workingTime = `${companyInfo.workingTime}`;
      jobDetail.WorkOvertime = `${companyInfo.WorkOvertime}`;
    }

    res.json({
      code: "success",
      message: "Lấy dữ liệu thành công",
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

export const applyPost = async (req: Request, res: Response) => {
  req.body.fileCV = req.file? req.file.path : "";

  const newRecord = new CV(req.body);
  await newRecord.save();
  
  res.json({
    code: "success",
    message: "Đã gửi CV thành công!"
  })
}