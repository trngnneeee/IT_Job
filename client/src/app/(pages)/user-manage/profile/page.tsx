import { Metadata } from "next"
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Mô tả trang thông tin cá nhân...",
}

export default function UserManageProfilePage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <h1 className="font-[700] text-[20px] text-black mb-[20px]">
              Thông tin cá nhân
            </h1>
            <ProfileForm/>
          </div>
        </div>
      </div>
    </>
  )
}