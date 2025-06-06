import { Request, Response } from "express";
import Cities from "../model/city.model";

export const list = async (req: Request, res: Response) => {
  const cityList = await Cities.find({});
  
  res.json({
    code: "success",
    message: "Lấy thông tin thành công!",
    cityList: cityList
  });
}