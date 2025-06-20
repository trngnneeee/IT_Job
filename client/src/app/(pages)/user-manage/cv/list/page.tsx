/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import { CVList } from "./CVList"

export const metadata: Metadata = {
  title: "Quản lý CV đã gửi",
  description: "Mô tả trang quản lý CV đã gửi...",
}

export default function UserManageCVListPage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">
            Quản lý CV đã gửi
          </h2>

          <CVList/>

          <div className="mt-[30px]">
            <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Trang 1</option>
              <option value="">Trang 2</option>
              <option value="">Trang 3</option>
            </select>
          </div>

        </div>
      </div>
    </>
  )
}