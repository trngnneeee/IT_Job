"use client"

import { useEffect, useState } from "react";
import { CVItem } from "./CVItem";

export const CVContainer = () => {
  const [CVList, setCVList] = useState<any[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/cv/list`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then((data) => {
        setCVList(data.CVList);
      })
  }, [])

  const handleDeleteSuccess = (id: string) => {
    setCVList(CVList.filter((item) => item.id != id))
  }
  
  return (
    <>
      <div className="container mx-auto px-[16px]">
        <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">
          Quản lý CV
        </h2>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
          {CVList && CVList.length > 0 && CVList.map((item, index) => (
            <CVItem
              key={index}
              item={item}
              handleDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>

        <div className="mt-[30px]">
          <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]">
            <option value="">Trang 1</option>
            <option value="">Trang 2</option>
            <option value="">Trang 3</option>
          </select>
        </div>

      </div>
    </>
  );
}