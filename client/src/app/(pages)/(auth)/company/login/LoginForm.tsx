"use client"

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const LoginForm = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#login-form");

    validator
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email!'
        },
        {
          rule: 'email',
          errorMessage: 'Email sai định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 kí tự!',
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một kí tự in hoa!',
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một kí tự in thường!',
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một kí tự đặc biệt!',
        }
      ])
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const finalData = {
          email: email,
          password: password
        };

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(finalData),
          credentials: "include"
        })
          .then(res => res.json())
          .then((data) => {
            if (data.code == "error") {
              alert(data.message);
            }
            if (data.code == "success") {
              router.push("/");
            }
          })
      })
  }, []);

  return (
    <>
      <form action="" className="grid grid-cols-1 gap-y-[15px]" id="login-form">
        <div className="">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            type="email"
            name=""
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            name=""
            id="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
      </form>
    </>
  );
}