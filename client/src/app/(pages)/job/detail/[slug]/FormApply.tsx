"use client"

import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export const FormApply = (props: {
  jobId: string
}) => {
  const { jobId } = props;
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validator = new JustValidate("#apply-form");

    validator
      .addField('#fullName', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập họ tên!'
        },
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email!'
        },
        {
          rule: 'email',
          errorMessage: 'Email sai định dạng!',
        },
      ])
      .addField('#phone', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập số điện thoại!'
        },
      ])
      .addField('#fileCV', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng tải lên file CV!'
        },
        {
          validator: (value: any, fields: any) => {
            const file = fields["#fileCV"]?.elem?.files?.[0];
            if (!file) return false;
            return file.size <= 5 * 1024 * 1024;
          },
          errorMessage: 'Kích thước file không được vượt quá 5MB!'
        },
        {
          validator: (value: any, fields: any) => {
            const file = fields["#fileCV"]?.elem?.files?.[0];
            if (!file) return false;
            return file.type === "application/pdf";
          },
          errorMessage: 'Chỉ chấp nhận file định dạng PDF!'
        }
      ])
      .onSuccess(() => {
        setIsValid(true);
      })
      .onFail(() => {
        setIsValid(false);
      })
  }, [])

  const handleSubmit = (event: any) => {
    if (isValid) {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const fileCV = event.target.fileCV.files[0];

      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("fileCV", fileCV);

      const promise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job/apply`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then((data) => {
          return data;
        })

      toast.promise(promise, {
        loading: "Đang xử lý...",
        success: (data) => data.message,
        error: (data) => data.message,
      })
    }
  }

  return (
    <>
      <Toaster/>
      <form id="apply-form" action="" className="" onSubmit={handleSubmit}>
        <div className="mb-[15px]">
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input type="text" name="fullName" id="fullName" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input type="email" name="email" id="email" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
            Số điện thoại *
          </label>
          <input type="text" name="phone" id="phone" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="fileCV" className="block font-[500] text-[14px] text-black mb-[5px]">
            File CV dạng PDF *
          </label>
          <input type="file" name="fileCV" id="fileCV" accept="application/pdf" className="" />
        </div>
        <button className="w-[100%] h-[48px] rounded-[4px] bg-[#0088FF] font-[700] text-[16px] text-white">
          Gửi CV ứng tuyển
        </button>
      </form>
    </>
  );
}