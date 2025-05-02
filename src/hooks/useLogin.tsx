import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export const useLogin = () => {
  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) throw new Error("Email atau Password salah");

    toast.success("Berhasil masuk");
  };

  return { login };
};
