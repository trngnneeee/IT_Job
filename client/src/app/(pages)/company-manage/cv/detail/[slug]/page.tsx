import { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { levelList, workingFormList } from "@/config/variable.config"

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Mô tả trang chi tiết CV...",
}

export default async function CompanyManageCVDetailPage({ params }: {
  params: {
    slug: string
  }
}) {
  const slug = await params.slug;

  const headerList = await headers();
  const cookie = headerList.get("cookie");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/cv/detail/${slug}`, {
    headers: {
      cookie: cookie || ""
    },
    cache: "no-store"
  });

  const data = await res.json();
  let cvDetail: any = {};
  let jobDetail: any = {};
  if (data.code == "success")
  {
    cvDetail = data.cvDetail;
    jobDetail = data.jobDetail;
  };

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          {/* Thông tin CV */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV
              </h2>
              <Link href="#" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>
            
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên:
              <span className="font-[700] ml-[5px]">
                {cvDetail.fullName}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Email:
              <span className="font-[700] ml-[5px]">
                {cvDetail.email}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại:
              <span className="font-[700] ml-[5px]">
                {cvDetail.phone}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>
            <div className="bg-[#D9D9D9] h-[736px]">
              <iframe src={cvDetail.fileCV} className="w-full h-full"></iframe>
            </div>
          </div>
          {/* Hết Thông tin CV */}
          
          {/* Thông tin công việc */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
              Thông tin công việc
            </h2>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Tên công việc:
              <span className="font-[700] ml-[5px]">
                {jobDetail.title}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Mức lương:
              <span className="font-[700] ml-[5px]">
                {jobDetail.salaryMin}$ -  {jobDetail.salaryMax}$
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Cấp bậc:
              <span className="font-[700] ml-[5px]">
                {levelList.find((item) => item.value == jobDetail.level)?.label}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Hình thức làm việc:
              <span className="font-[700] ml-[5px]">
                {workingFormList.find((item) => item.value == jobDetail.workingForm)?.label}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Công nghệ:
              <span className="font-[700] ml-[5px]">
                {jobDetail.technologies.join(", ")}
              </span>
            </div>
            <Link href={`/job/detail/${jobDetail.id}`} className="font-[400] text-[14px] text-[#0088FF] underline">
              Xem chi tiết công việc
            </Link>
          </div>
          {/* Hết Thông tin công việc */}
        </div>
      </div>
    </>
  )
}