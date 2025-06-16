import { Request, Response } from "express";
import CompanyJob from "../model/company-job.model";
import Cities from "../model/city.model";
import CompanyAccount from "../model/company-account.model";

export const searchGet = async (req: Request, res: Response) => {
  const jobList = [];
  let totalPage = 0;
  let totalJob = 0;

  if (Object.keys(req.query).length > 0)
  {
    const find: any = {};
    
    if (req.query.language)
    {
      find.technologies = req.query.language;
    }

    if (req.query.city)
    {
      const city = await Cities.findOne({
        name: req.query.city
      });

      if (city)
      {
        const accountCompanyList = await CompanyAccount.find({
          city: city.id
        })
        const idList = accountCompanyList.map((item) => item.id);
        find.companyId = { $in: idList }
      }
    }

    if (req.query.company)
    {
      const companyDetail = await CompanyAccount.findOne({
        companyName: req.query.company
      });
      find.companyId = companyDetail?.id;
    }

    if (req.query.keyword)
    {
      const keywordRegex = new RegExp(`${req.query.keyword}`, "i");
      find["$or"] = [
        { title: keywordRegex },
        { technologies: keywordRegex }
      ];
    }

    if (req.query.level)
    {
      find.level = req.query.level;
    }

    if (req.query.workingForm)
    {
      find.workingForm = req.query.workingForm
    }

    const limit = 3;
    const totalRecord = await CompanyJob.countDocuments(find);
    totalJob = totalRecord;
    totalPage = Math.ceil(totalRecord / limit);
    let page = 1;
    if (req.query.page)
    {
      const tmp = parseInt(`${req.query.page}`);
      if (tmp > 0) page = tmp;
    }
    if (totalPage != 0 && page > totalPage)
    {
      page = totalPage;
    }
    const skip = (page - 1) * limit;
    

    const jobs = await CompanyJob.find(find).sort({
      createdAt: "desc"
    }).limit(limit).skip(skip)
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
    jobList: jobList,
    totalPage: totalPage,
    totalRecord: totalJob
  })
}