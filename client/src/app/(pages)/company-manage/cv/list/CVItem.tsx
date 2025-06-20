import Link from "next/link";
import { FaBriefcase, FaCircleCheck, FaEnvelope, FaEye, FaPhone, FaUserTie } from "react-icons/fa6";
import { levelList, workingFormList, cvStatusList } from "@/config/variable.config";
import { toast } from "sonner";
import { useState } from "react";
import { DeleteButton } from "@/app/components/button/DeleteButton";

export const CVItem = (props: {
  item: any,
  handleDeleteSuccess: (id: string) => void
}) => {
  const { item, handleDeleteSuccess } = props;
  const [action, setAction] = useState(item.status);

  const handleChangeStatus = (status: any) => {
    const finalData = {
      status: status,
      id: item.id
    }

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/cv/change-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalData),
      credentials: "include"
    })
      .then(res => res.json())
      .then((data) => {
        if (data.code == "success") {
          toast.success(data.message);
          setAction(status);

        }
        if (data.code == "error") {
          toast.error(data.message);
        }
      })
  }

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
          Ứng viên: <span className="font-[700]">{item.fullName}</span>
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaEnvelope className="" /> {item.email}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaPhone className="" /> {item.phone}
        </div>
        <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
          {item.salaryMin.toLocaleString("vi-VN")}$ - {item.salaryMax.toLocaleString("vi-VN")}$
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaUserTie className="text-[16px]" /> {levelList.find((level) => level.value == item.level)?.label}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaBriefcase className="text-[16px]" /> {workingFormList.find((level) => level.value == item.workingForm)?.label}
        </div>
        <div className={"mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] " + (item.viewed ? "text-[#121212]" : "text-[#FF0000]")}>
          <FaEye className="text-[16px]" /> {item.viewed ? "Đã xem" : "Chưa xem"}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]" style={{
          color: cvStatusList.find((tmp) => (tmp.value == action))?.color
        }}>
          <FaCircleCheck className="text-[16px]" /> {cvStatusList.find((tmp) => tmp.value == action)?.label}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
          <Link href={`/company-manage/cv/detail/${item.id}`} className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
            Xem
          </Link>
          {(action == "deny" || action == "initial") && (
            <button onClick={() => handleChangeStatus("accept")} className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]">
              Duyệt
            </button>
          )}
          {(action == "accept") && (
            <button onClick={() => handleChangeStatus("deny")} className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
              Từ chối
            </button>
          )}
          <DeleteButton
            api={`${process.env.NEXT_PUBLIC_BASE_URL}/company/cv/delete/${item.id}`}
            item={item}
            onSuccess={handleDeleteSuccess}
          />
        </div>
      </div>
    </>
  );
}