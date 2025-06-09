"use client"

import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginPreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { EditorTinyMCE } from "@/app/components/editor/EditorTinyMCE";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginPreview);

interface ICity {
  _id: String,
  name: String
}

export const CompanyProfileForm = () => {
  const { infoCompany } = useAuth();
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [logos, setLogos] = useState<any[]>();
  const [isValid, setIsValid] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/city/list`)
      .then(res => res.json())
      .then(data => {
        setCityList(data.cityList);
      })
  }, [])

  useEffect(() => {
    if (infoCompany) {
      if (infoCompany.logo) {
        setLogos([
          {
            source: infoCompany.logo,
          }
        ])
      }

      const validator = new JustValidate("#company-profile-form");

      validator
        .addField('#companyName', [
          {
            rule: 'required',
            errorMessage: 'Vui lòng nhập email!'
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
        .onSuccess(() => {
          setIsValid(true);
        })
        .onFail(() => {
          setIsValid(false);
        })
    }
  }, [infoCompany])

  const handleSubmitForm = (event: any) => {
    if (isValid) {
      event.preventDefault();
      const companyName = event.target.companyName.value;
      let logo = null;
      if (logos && logos.length > 0) {
        logo = logos[0].file;
      }
      const city = event.target.city.value;
      const address = event.target.address.value;
      const companyModel = event.target.companyModel.value;
      const companyEmployees = event.target.companyEmployees.value;
      const workingTime = event.target.workingTime.value;
      const WorkOvertime = event.target.WorkOvertime.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      let description = "";
      if (editorRef.current) {
        description = (editorRef.current as any).getContent();
      }

      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("logo", logo);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("companyModel", companyModel);
      formData.append("companyEmployees", companyEmployees);
      formData.append("workingTime", workingTime);
      formData.append("WorkOvertime", WorkOvertime);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("description", description);

      const updatePromise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/profile`, {
        method: "PATCH",
        body: formData,
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          return data;
        })

      toast.promise(updatePromise, {
        loading: "Đang cập nhật thông tin...",
        success: (data) => data.message || data.message,
        error: (err) => err.message || err.message,
      });
    }
  }

  return (
    <>
      <Toaster />
      {infoCompany && (
        <>
          <form action="" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="company-profile-form" onSubmit={handleSubmitForm}>
            <div className="sm:col-span-2">
              <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
                Tên công ty *
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                defaultValue={infoCompany.companyName}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">
                Logo
              </label>
              <FilePond
                name="avatar"
                allowMultiple={false}
                allowRemove={true}
                acceptedFileTypes={["image/*"]}
                labelIdle="+"
                files={logos}
                onupdatefiles={setLogos}
              />
            </div>
            <div className="">
              <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">
                Thành phố
              </label>
              <select
                name="city"
                id="city"
                defaultValue={infoCompany.city}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[13px] text-black"
              >
                {cityList.map((item, index) => (
                  <option value={String(item._id)} key={index}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="">
              <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                id="address"
                defaultValue={infoCompany.address}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">
                Mô hình công ty
              </label>
              <input
                type="text"
                name="companyModel"
                id="companyModel"
                defaultValue={infoCompany.companyModel}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">
                Quy mô công ty
              </label>
              <input
                type="text"
                name="companyEmployees"
                id="companyEmployees"
                defaultValue={infoCompany.companyEmployees}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">
                Thời gian làm việc
              </label>
              <input
                type="text"
                name="workingTime"
                id="workingTime"
                defaultValue={infoCompany.workingTime}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="WorkOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">
                Làm việc ngoài giờ
              </label>
              <input
                type="text"
                name="WorkOvertime"
                id="WorkOvertime"
                defaultValue={infoCompany.WorkOvertime}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                Email *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={infoCompany.email}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="">
              <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                defaultValue={infoCompany.phone}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
                Mô tả chi tiết
              </label>
              <EditorTinyMCE
                editorRef={editorRef}
                value={infoCompany.description}
              />
            </div>
            <div className="sm:col-span-2">
              <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
                Cập nhật
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}