"use client";

// import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPaymentDetail } from "@/services/mainService";
import { formatRupiah } from "@/lib/utils";

const PaymentSuccess = () => {
  const router = useRouter();
  const orderId = useSearchParams().get("order_id");

  const { data, isLoading } = useQuery({
    queryKey: ["transactionDetails", orderId],
    queryFn: () => getPaymentDetail(orderId as string),
  });

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleViewOrder = () => {
    router.push(`/profile`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen md:pt-24 md:pb-10 bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-green-50 rounded-t-lg pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Pembayaran Berhasil!
          </CardTitle>
          <CardDescription className="text-green-600">
            Transaksi Anda telah berhasil diproses
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">ID Pesanan</span>
              <span className="font-medium">{data?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nama Lapangan</span>
              <span className="font-medium">{data?.courtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Pembayaran</span>
              <span className="font-medium">{formatRupiah(data?.amount)}</span>
            </div>
            {/* Buatkan tanggal */}
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal Pembayaran</span>
              <span className="font-medium">
                {new Date(data?.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Metode Pembayaran</span>
              <span className="font-medium">{data?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600">
                {data?.status === "settlement" ? "Paid" : data.status}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Tanda terima pembayaran telah dikirim ke email Anda. Terima kasih
              telah melakukan pembelian.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleBackToHome}
          >
            Kembali ke Beranda
          </Button>
          <Button
            className="w-full bg-primary hover:bg-green-700"
            onClick={handleViewOrder}
          >
            Lihat Pesanan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
