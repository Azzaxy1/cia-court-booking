"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { images } from "@/assets";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

interface AuthFormProps {
  isLogin?: boolean;
  className?: string;
}

const AuthForm = ({ isLogin, className }: AuthFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (res?.error) {
          setError("Email atau Password salah");
          toast.error("Email atau Password salah");
          setIsLoading(true);
          return;
        } else {
          router.push("/");
          toast.success("Berhasil masuk");
        }
      } else {
        if (!form.name || !form.email || !form.phone || !form.password) {
          setError("Semua field harus diisi");
          return;
        }

        const res = await axios.post("/api/register", form);

        if (res.status !== 201) {
          setError(res.data.message || "Gagal mendaftar");
          return;
        } else {
          setIsLoading(true);
          router.push("/login");
          toast.success(res.data.message || "Berhasil mendaftar");
        }
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className={`p-6 md:p-8 ${isLogin ? "order-2" : "order-1"}`}
            onSubmit={handleSubmit}
          >
            <div className={`flex flex-col ${isLogin ? "gap-6" : "gap-3"}`}>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">CIA Serang</h1>
                <p className="text-balance text-muted-foreground">
                  {isLogin ? "Masuk ke akun Anda" : "Daftarkan akun baru Anda"}
                </p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">No Telepon</Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="081234567890"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      name="phone"
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="*******"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full text-white"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 1C5.372 1 0 6.372 0 13s5.372 12 12 12 12-5.372 12-12S18.628 1 12 1zm0 22c-5.523 0-10-4.477-10-10S6.477 3 12 3s10 4.477 10 10-4.477 10-10 10z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {isLogin ? "Masuk" : "Daftar"}
              </Button>
              <div className="gap-4 w-full">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                {isLogin ? "Belum" : "Sudah"} punya akun?{" "}
                <Link
                  href={isLogin ? "/register" : "/login"}
                  className="underline underline-offset-4"
                >
                  {isLogin ? "Daftar" : "Masuk"} disini
                </Link>
              </div>
            </div>
          </form>
          <div className={`hidden bg-primary md:block`}>
            <div className="flex justify-center h-full items-center">
              <Link href="/">
                <Image
                  src={images.LogoWhite}
                  alt="Image"
                  className="inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                  width={300}
                  height={300}
                />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AuthForm };
