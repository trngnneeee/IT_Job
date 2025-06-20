"use client"

import { useEffect, useState } from "react";
import { CVItem } from "./CVItem";

export const CVList = () => {
  const [CVList, setCVList] = useState<any[]>([])

  const handleDeleteSuccess = (id: string) => {
    setCVList(CVList.filter((item) => item.id != id));
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/cv/list`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then((data) => {
        setCVList(data.CVList);
      })
  }, [])

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {CVList && CVList.length && CVList.map((item, index) => (
          <CVItem
            key={index}
            item={item}
            handleDeleteSuccess={handleDeleteSuccess}
          />
        ))}
      </div>
    </>
  );
}