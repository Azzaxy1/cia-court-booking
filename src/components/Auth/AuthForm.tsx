"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { images } from "@/assets";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { register } from "@/services/authService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  FaGoogle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/validation";
import { useLogin } from "@/hooks/useLogin";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthFormProps {
  isLogin?: boolean;
  className?: string;
}

const AuthForm = ({ isLogin = false, className }: AuthFormProps) => {
  const router = useRouter();
  const { login } = useLogin();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success("Berhasil mendaftar! Silakan login");
        router.push("/login");
      } else {
        toast.error(data.message || "Gagal mendaftar");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat mendaftar");
    },
  });

  const onSubmit = async (formData: Record<string, string>) => {
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        router.push("/lapangan");
      } else {
        mutate(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(
          `Gagal ${isLogin ? "masuk" : "mendaftar"}. ${String(error)}`
        );
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: `${window.location.origin}/lapangan`,
      });

      if (result?.error) {
        console.error("Google login error:", result.error);

        // Handle specific error types
        if (result.error === "OAuthAccountNotLinked") {
          toast.error(
            "Email ini sudah terdaftar dengan metode login lain. Silakan gunakan email dan password untuk masuk."
          );
        } else if (result.error === "OAuthCallback") {
          toast.error(
            "Terjadi kesalahan saat menghubungkan dengan Google. Silakan coba lagi."
          );
        } else {
          toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
        }
      } else if (result?.ok) {
        toast.success("Berhasil masuk dengan Google");
        router.push("/lapangan");
        router.refresh();
      }
    } catch (error) {
      toast.error(`Gagal masuk dengan Google. ${String(error)}`);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto space-y-6">
              <div className="text-center space-y-3">
                <div>
                  <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
                    {isLogin ? "Selamat Datang!" : "Bergabung Bersama Kami"}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {isLogin
                      ? "Masuk ke akun Anda untuk melanjutkan"
                      : "Daftarkan akun baru untuk memulai"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-200"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="text-red-500 mr-3" />
                <span className="font-medium">
                  {isLogin ? "Masuk" : "Daftar"} dengan Google
                </span>
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-muted-foreground">
                  atau
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama"
                          className="pl-10 h-12 border-2 focus:border-primary"
                          {...formRegister("name")}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        No. Telepon
                      </Label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <Input
                          id="phone"
                          type="text"
                          placeholder="081234567890"
                          className="pl-10 h-12 border-2 focus:border-primary"
                          {...formRegister("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 h-12 border-2 focus:border-primary"
                      {...formRegister("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                      {...formRegister("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <input
                    type="hidden"
                    {...formRegister("role")}
                    value="CUSTOMER"
                  />
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSubmitting || isPending}
                >
                  {isSubmitting || isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <span className="font-semibold">
                      {isLogin ? "Masuk ke Akun" : "Buat Akun"}
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                  <Link
                    href={isLogin ? "/register" : "/login"}
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {isLogin ? "Daftar di sini" : "Masuk di sini"}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
              <div className="text-center">
                <Link href="/" className="inline-block">
                  <Image
                    src={images.LogoWhite}
                    alt="CIA Serang Logo"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </Link>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">CIA Serang</h2>
                  <p className="text-lg text-white/90 max-w-md">
                    Tempat terpercaya untuk penyewaan lapangan olahraga di
                    Serang. Booking mudah, bayar praktis!
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 right-20 w-12 h-12 border border-white/20 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
