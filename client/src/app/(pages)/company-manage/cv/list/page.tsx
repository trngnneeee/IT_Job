/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import { CVContainer } from "./CVContainer"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Quản lý CV",
  description: "Mô tả trang quản lý CV...",
}

export default function CompanyManageCVListPage() {
  return (
    <>
      <Toaster/>
      <div className="py-[60px]">
        <CVContainer/>
      </div>
    </>
  )
}