"use client"

import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginPreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginPreview);

export const ProfileForm = () => {
  const router = useRouter();
  const { infoUser } = useAuth();
  const [avatars, setAvatars] = useState<any[]>();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (infoUser) {
      if (infoUser.avatar) {
        setAvatars([
          {
            source: infoUser.avatar
          }
        ])
      }

      const validator = new JustValidate("#profile-form");

      validator
        .addField('#fullName', [
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
  }, [infoUser])

  const handleSubmitForm = (event: any) => {
    if (isValid) {
      event.preventDefault();
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;

      let avatar = null;
      if (avatars && avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("avatar", avatar);

      const updatePromise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`, {
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
      {infoUser && (
        <>
          <form onSubmit={handleSubmitForm} action="" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="profile-form">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                Họ tên *
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                defaultValue={infoUser.fullName}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="avatar" className="block font-[500] text-[14px] text-black mb-[5px]">
                Avatar
              </label>
              <FilePond
                name="avatar"
                allowMultiple={false}
                allowRemove={true}
                acceptedFileTypes={["image/*"]}
                labelIdle="+"
                files={avatars}
                onupdatefiles={setAvatars}
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
                defaultValue={infoUser.email}
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
                defaultValue={infoUser.phone}
                className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
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