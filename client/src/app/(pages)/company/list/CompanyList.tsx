"use client"

import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<any[]>([])
  const [totalPage, setTotalPage] = useState("");
  const [page, setPage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/list?limitItem=6&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setCompanyList(data.companyList);
        setTotalPage(data.totalPage);
      })
  }, [page])

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
        {companyList.map((item, index) => (
          <CardCompanyItem
            key={index}
            companyDetail={item}
          />
        ))}
      </div>

      <div className="mt-[30px]">
        <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] outline-none" onChange={(event: any) => setPage(event?.target.value)}>
          {[...Array(totalPage)].map((_, i) => (
            <option value={i + 1} key={i}>Trang {i + 1}</option>
          ))}
        </select>
      </div>
    </>
  );
}