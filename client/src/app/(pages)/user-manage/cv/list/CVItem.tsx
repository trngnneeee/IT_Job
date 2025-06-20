import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
import { cvStatusList, levelList, workingFormList } from "@/config/variable.config";
import { DeleteButton } from "@/app/components/button/DeleteButton";
import Link from "next/link";

export const CVItem = (props: {
  item: any,
  handleDeleteSuccess: (id: string) => void
}) => {
  const { item, handleDeleteSuccess } = props;

  return (
    <>
      <div
        className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
        style={{
          background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
        }}
      >
        <img
          src="/assets/images/card-bg.svg"
          alt=""
          className="absolute top-[0px] left-[0px] w-[100%] h-auto"
        />
        <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
          {item.title}
        </h3>
        <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
          Công ty: <span className="font-[700]">{item.companyName}</span>
        </div>
        <div className="mt-[6px] text-center font-[600] text-[16px] text-[#0088FF]">
          {item.salaryMin.toLocaleString("vi-VN")}$ - {item.salaryMax.toLocaleString("vi-VN")}$
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaUserTie className="text-[16px]" /> {levelList.find((tmp) => tmp.value == item.level)?.label}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaBriefcase className="text-[16px]" /> {workingFormList.find((tmp) => tmp.value == item.workingForm)?.label}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]" style={{
          color: cvStatusList.find((tmp) => (tmp.value == item.status))?.color
        }}>
          <FaCircleCheck className="text-[16px]" /> {cvStatusList.find((tmp) => tmp.value == item.status)?.label}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
          <Link href="#" className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
            Xem
          </Link>
          <DeleteButton
            api={`${process.env.NEXT_PUBLIC_BASE_URL}/user/cv/delete/${item.id}`}
            item={item}
            onSuccess={() => handleDeleteSuccess(item.id)}
          />
        </div>
      </div>
    </>
  );
}