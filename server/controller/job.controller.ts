import { Request, Response } from "express";
import CompanyJob from "../model/company-job.model";
import CompanyAccount from "../model/company-account.model";

export const detailGet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const jobRawDetail = await CompanyJob.findOne({
      _id: id
    })
    const jobDetail = {
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