import { Request, Response } from "express";
import CompanyJob from "../model/company-job.model";
import Cities from "../model/city.model";
import CompanyAccount from "../model/company-account.model";

export const searchGet = async (req: Request, res: Response) => {
  const jobList = [];
  
  if (Object.keys(req.query).length > 0)
  {
    const find: any = {};
    
    if (req.query.language)
    {
      find.technologies = req.query.language;
    }

    const jobs = await CompanyJob.find(find).sort({
      createdAt: "desc"
    })
    for (const job of jobs)
    {
      const tmp = {
        id: job.id,
        logo: "",
        title: job.title,
        companyName: "",
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        level: job.level,
        workingForm: job.workingForm,
        city: "",
        technologies: job.technologies,
      };

      const companyInfo = await CompanyAccount.findOne({
        _id: job.companyId
      });
      tmp.logo = `${companyInfo?.logo}`;
      tmp.companyName = `${companyInfo?.companyName}`;
      const cityInfo = await Cities.findOne({
        _id: companyInfo?.city
      });
      tmp.city = `${cityInfo?.name}`;
      jobList.push(tmp);
    }
  }

  res.json({
    code: "success",
    message: "Lấy dữ liệu thành công",
    jobList: jobList
  })
}