import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const applyPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
      }),
    jobId: Joi.string()
      .required()
      .messages({
        "string.empty": "ID công việc không có!",
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    phone: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
      }),
    fileCV: Joi.string().allow("")
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}