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

import { register } from "@/services/authService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/validation";
import { useLogin } from "@/hooks/useLogin";
import { z } from "zod";
import { signIn } from "next-auth/react";

interface AuthFormProps {
  isLogin?: boolean;
  className?: string;
}

const AuthForm = ({ isLogin = false, className }: AuthFormProps) => {
  const router = useRouter();
  const { login } = useLogin();
  const queryClient = useQueryClient();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", phone: "", password: "", role: "CUSTOMER" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    retry: 1,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      if (data.success) {
        toast.success("Berhasil mendaftar");
        router.push("/login");
      } else {
        toast.error(data.message || "Gagal mendaftar");
      }
    },
    onError: () => {
      toast.error("Terjadi kesalahan, silakan coba lagi.");
    },
  });

  const onSubmit = async (formData: Record<string, string>) => {
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        router.push("/");
      } else {
        mutate(formData);
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan, silakan coba lagi. ${String(error)}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: `${window.location.origin}/`,
      }).then((res) => {
        if (res?.error) {
          toast.error("Gagal masuk dengan Google");
        } else {
          toast.success("Berhasil masuk dengan Google");
          router.push("/");
        }
      });
    } catch (error) {
      toast.error(`Gagal masuk dengan Google. ${String(error)}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className={`p-6 md:p-8 ${isLogin ? "order-2" : "order-1"}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={`flex flex-col ${isLogin ? "gap-6" : "gap-3"}`}>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">CIA Serang</h1>
                  <p className="text-balance text-muted-foreground">
                    {isLogin
                      ? "Masuk ke akun Anda"
                      : "Daftarkan akun baru Anda"}
                  </p>
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
                        {...formRegister("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors?.name?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">No Telepon</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="081234567890"
                        required
                        {...formRegister("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors?.phone?.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    {...formRegister("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="*******"
                    {...formRegister("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>
                {!isLogin && (
                  <Input id="role" type="hidden" {...formRegister("role")} />
                )}
                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={isSubmitting || isPending}
                >
                  {isSubmitting || isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <FaSpinner className="animate-spin mr-2" size={16} />{" "}
                      Loading...
                    </span>
                  ) : isLogin ? (
                    "Masuk"
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </div>
            </form>
            <div className="text-center text-sm text-muted-foreground mt-4">
              {isLogin ? "Belum" : "Sudah"} punya akun?{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="underline underline-offset-4"
              >
                {isLogin ? "Daftar" : "Masuk"} disini
              </Link>
            </div>
            <div className="gap-4 w-full mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <FaGoogle />
                <span>Masuk dengan Google</span>
              </Button>
            </div>
          </div>

          <div className={`hidden bg-primary md:block`}>
            <div className="flex justify-center h-full items-center">
              <Link href="/">
                <Image
                  src={images.LogoWhite}
                  alt="CIA Serang logo"
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

export default AuthForm;
