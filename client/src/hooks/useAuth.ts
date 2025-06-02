import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
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
          setInfoUser(data.infoUser);
        }
      })
  }, [pathName]);

  return { isLogin, infoUser };
}