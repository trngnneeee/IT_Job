import { Metadata } from "next"
import Link from "next/link"
import { CompanyJobCreateForm } from "./CompanyJobCreateForm"

export const metadata: Metadata = {
  title: "Thêm mới công việc",
  description: "Mô tả trang thêm mới công việc...",
}

export default function CompanyManageJobCreatePage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h1 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thêm mới công việc
              </h1>
              <Link href="/company-manage/job/list" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>
            
            <CompanyJobCreateForm/>
          </div>
        </div>
      </div>
    </>
  )
}