"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked: 
    "Email ini sudah terdaftar dengan metode login lain. Silakan gunakan email dan password untuk masuk, atau gunakan email Google yang berbeda.",
  OAuthCallback: 
    "Terjadi kesalahan saat menghubungkan dengan Google. Pastikan Anda memberikan izin yang diperlukan dan coba lagi.",
  AccessDenied: 
    "Akses ditolak. Anda tidak memberikan izin yang diperlukan untuk masuk.",
  Configuration: 
    "Terjadi kesalahan konfigurasi. Silakan hubungi administrator.",
  default: 
    "Terjadi kesalahan saat mencoba masuk. Silakan coba lagi."
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Gagal Masuk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {errorMessage}
              </p>
              {error && (
                <p className="text-xs text-gray-400 mt-2">
                  Error: {error}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">
                  Coba Lagi
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <FaArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Butuh bantuan? Hubungi kami di{" "}
                <a href="tel:0851-8219-8144" className="text-primary hover:underline">
                  0851-8219-8144
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
