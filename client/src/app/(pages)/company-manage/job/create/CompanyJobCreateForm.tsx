"use client"

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginPreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { EditorTinyMCE } from "@/app/components/editor/EditorTinyMCE";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { levelList, workingFormList } from "@/config/variable.config";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginPreview);

export const CompanyJobCreateForm = () => {
  const router = useRouter();
  const editorRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const validator = new JustValidate("#job-create-form");

    validator
      .addField('#title', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập tên công việc!'
        },
      ])
      .addField('#salaryMin', [
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Lương tối thiểu phải lớn hơn 0!'
        },
      ])
      .addField('#salaryMax', [
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Lương tối đa phải lớn hơn 0!'
        },
      ])
      .addField('#level', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng chọn cấp bậc!'
        },
      ])
      .addField('#workingForm', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng chọn hình thức làm việc!'
        },
      ])
      .onSuccess(() => {
        setIsValid(true);
      })
      .onFail(() => {
        setIsValid(false);
      })
  }, [])

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const title = event.target.title.value;
    const salaryMin = event.target.salaryMin.value;
    const salaryMax = event.target.salaryMax.value;
    const level = event.target.level.value;
    const workingForm = event.target.workingForm.value;
    const technologies = event.target.technologies.value;
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }

    if (isValid) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("salaryMin", salaryMin);
      formData.append("salaryMax", salaryMax);
      formData.append("level", level);
      formData.append("workingForm", workingForm);
      formData.append("technologies", technologies);
      formData.append("description", description);

      if (images.length) 
        {
        for (const image of images) 
        {
          formData.append("images", image.file);
        }
      }

      const promise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/job/create`, {
        method: "POST",
        body: formData,
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          return data;
        })

      toast.promise(promise, {
        loading: "Đang xử lý...",
        success: (data) => {
          router.push("/company-manage/job/list");
          return data.message;
        },
        error: (data) => {
          event.target.reset();
          setImages([]);
          return data.message;
        }
      })
    }
  }

  return (
    <>
      <Toaster/>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="job-create-form">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công việc *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối thiểu ($)
          </label>
          <input
            type="number"
            name="salaryMin"
            id="salaryMin"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối đa ($)
          </label>
          <input
            type="number"
            name="salaryMax"
            id="salaryMax"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="level" className="block font-[500] text-[14px] text-black mb-[5px]">
            Cấp bậc *
          </label>
          <select
            name="level"
            id="level"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
            {levelList.map((item, index) => (
              <option value={item.value} key={index}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="">
          <label htmlFor="workingForm" className="block font-[500] text-[14px] text-black mb-[5px]">
            Hình thức làm việc *
          </label>
          <select
            name="workingForm"
            id="workingForm"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
            {workingFormList.map((item, index) => (
              <option value={item.value} key={index}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">
            Các công nghệ
          </label>
          <input
            type="text"
            name="technologies"
            id="technologies"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="images" className="block font-[500] text-[14px] text-black mb-[5px]">
            Danh sách ảnh *
          </label>
          <FilePond
            name="avatar"
            allowMultiple={true}
            allowRemove={true}
            acceptedFileTypes={["image/*"]}
            labelIdle="+"
            files={images}
            onupdatefiles={setImages}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô tả chi tiết
          </label>
          <EditorTinyMCE
            editorRef={editorRef}
            id="description"
          />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Tạo mới
          </button>
        </div>
      </form>
    </>
  );
}