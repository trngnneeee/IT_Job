"use client"

import { CardJobItem } from "@/app/components/card/CardJobItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { levelList, workingFormList } from "@/config/variable.config";

export const SearchContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const level = searchParams.get("level") || "";
  const workingForm = searchParams.get("workingForm") || "";
  const page = searchParams.get("page") || "";
  const [jobList, setJobList] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState("");
  const [totalRecord, setTotalRecord] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (language) params.append("language", language);
    if (city) params.append("city", city);
    if (company) params.append("company", company);
    if (keyword) params.append("keyword", keyword);
    if (level) params.append("level", level);
    if (workingForm) params.append("workingForm", workingForm);
    if (page) params.append("page", page);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setJobList(data.jobList);
        setTotalPage(data.totalPage);
        setTotalRecord(data.totalRecord);
      });
  }, [language, city, company, keyword, level, workingForm, page]);

  const handleLevelFilter = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("level", value);
    } else {
      params.delete("level");
    }

    router.push(`?${params.toString()}`);
  }

  const handleWorkingFormFilter = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("workingForm", value);
    } else {
      params.delete("workingForm");
    }

    router.push(`?${params.toString()}`);
  }

  const handlePagination = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("page", value);
    } else {
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <>
      <div className="container mx-auto px-[16px]">

        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          {totalRecord} việc làm: <span className="text-[#0088FF]">{language} {city} {company} {keyword}</span>
        </h2>

        <div
          className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
          style={{
            boxShadow: "0px 4px 20px 0px #0000000F"
          }}
        >
          <select
            name=""
            className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={handleLevelFilter}
            defaultValue={level}
          >
            <option value="">Cấp bậc</option>
            {levelList.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select 
            name="" 
            className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={handleWorkingFormFilter}
            value={workingForm}
          >
            <option value="">Hình thức làm việc</option>
            {workingFormList.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
          {jobList && jobList.length > 0 && jobList.map((item, index) => (
            <CardJobItem
              job={item}
              key={index}
            />
          ))}
        </div>

        <div className="mt-[30px]">
          <select 
            name="" 
            className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] outline-none"
            value={page}
            onChange={handlePagination}
          >
            {[...Array(totalPage)].map((_, i) => (
              <option value={i + 1} key={i}>Trang {i + 1}</option>
            ))}
          </select>
        </div>

      </div>
    </>
  );
}