"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserTie, FaBriefcase, FaLocationDot } from "react-icons/fa6";
import { levelList, workingFormList } from "@/config/variable.config";

export const JobList = () => {
  const [jobList, setJobList] = useState<any[]>([]);
  const [totalPage, settotalPage] = useState<any>();
  const [page, setPage] = useState("");
  useEffect(() => {
    let query = "";
    if (page) query += `?page=${page}`

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/job/list${query}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setJobList(data.jobList);
        settotalPage(data.totalPage);
      })
  }, [page])

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList && jobList.length > 0 && jobList.map((item, index) => (
          <div
            className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
            style={{
              background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
            }}
            key={index}
          >
            <img
              src="/assets/images/card-bg.svg"
              alt=""
              className="absolute top-[0px] left-[0px] w-[100%] h-auto"
            />
            <div
              className="relative mt-[20px] w-[116px] h-[116px] bg-white mx-auto rounded-[8px] p-[10px]"
              style={{
                boxShadow: "0px 4px 24px 0px #0000001F"
              }}
            >
              <img
                src={item.logo}
                alt={item.title}
                className="w-[100%] h-[100%] object-contain"
              />
            </div>
            <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
              {item.title}
            </h3>
            <div className="mt-[6px] text-center font-[400] text-[14px] text-[#121212]">
              {item.company}
            </div>
            <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
              {item.salaryMin.toLocaleString("vi-VN")}$ - {item.salaryMax.toLocaleString("vi-VN")}$
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaUserTie className="text-[16px]" /> {levelList.find((pos) => pos.value == item.level)?.label}
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaBriefcase className="text-[16px]" /> {workingFormList.find((pos) => pos.value == item.workingForm)?.label}
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaLocationDot className="text-[16px]" /> {item.city}
            </div>
            <div className="mt-[12px] mb-[20px] mx-[16px] flex flex-wrap justify-center gap-[8px]">
              {item.technologies && item.technologies.length && item.technologies.map((tech: string, indexTech: number) => (
                <div className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]" key={indexTech}>
                  {tech}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-[12px] mb-[20px]">
              <Link href={`/company-manage/job/edit/${item.id}`} className="bg-[#FFB200] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]">
                Sửa
              </Link>
              <Link href="#" className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                Xóa
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[30px]">
        <select
          name=""
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
          onChange={(event) => setPage(event.target.value)}
        >
          {[...Array(totalPage)].map((_, i) => (
            <option value={i + 1} key={i}>Trang {i + 1}</option>
          ))}
        </select>
      </div>
    </>
  );
}