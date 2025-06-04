/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoCompany, setInfoCompany] = useState<any>();
  const [infoUser, setInfoUser] = useState<any>();
  const pathName = usePathname();
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/check`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "error")
        {
          setIsLogin(false);
        }
        if (data.code == "success")
        {
          setIsLogin(true);
          if(data.infoUser) setInfoUser(data.infoUser);
          else setInfoUser(null);
          if(data.infoCompany) setInfoCompany(data.infoCompany);
          else setInfoCompany(null);
        }
      })
  }, [pathName]);

  return { isLogin, infoUser, infoCompany };
}