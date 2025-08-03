"use client";

import { CheckCircle, Mail } from "lucide-react";
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
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const router = useRouter();
  const orderId = useSearchParams().get("order_id");
  const [emailSent, setEmailSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["transactionDetails", orderId],
    queryFn: () => getPaymentDetail(orderId as string),
  });

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      try {
        setIsProcessing(true);

        const response = await axios.post("/api/send-payment-email", {
          orderId,
          bookingData: data,
        });

        if (response.status === 200) {
          setEmailSent(true);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal mengirim email konfirmasi. Silakan coba lagi."
        );
      } finally {
        setIsProcessing(false);
      }
    };

    if (orderId && data && !emailSent) {
      sendConfirmationEmail();
    }
  }, [orderId, data, emailSent]);

  const handleBackToHome = () => {
    setIsRedirecting(true);
    router.push("/");
  };

  const handleViewOrder = () => {
    setIsRedirecting(true);
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
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center bg-green-50 rounded-t-lg pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Pembayaran Berhasil!
          </CardTitle>
          <CardDescription className="text-green-600">
            {data?.type === "recurringBooking"
              ? "Pemesanan berulang Anda telah berhasil diproses"
              : "Transaksi Anda telah berhasil diproses"}
          </CardDescription>

          {/* Email status indicator */}
          <div className="mt-4">
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Mengirim konfirmasi email...</span>
              </div>
            ) : emailSent ? (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Mail className="h-4 w-4" />
                <span>Konfirmasi telah dikirim ke email Anda</span>
              </div>
            ) : (
              <div className="text-sm text-orange-600">
                Email konfirmasi gagal dikirim
              </div>
            )}
          </div>
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

            {/* Conditional rendering based on booking type */}
            {data?.type === "booking" ? (
              // Regular booking details
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Bermain</span>
                  <span className="font-medium">
                    {new Date(data.bookingDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Waktu Bermain</span>
                  <span className="font-medium">
                    {data.startTime} - {data.endTime}
                  </span>
                </div>
              </>
            ) : data?.type === "recurringBooking" ? (
              // Recurring booking details
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal Berulang</span>
                  <span className="font-medium">{data.recurringSchedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Periode</span>
                  <span className="font-medium">
                    {new Date(data.startDate).toLocaleDateString("id-ID")} -{" "}
                    {new Date(data.endDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Sesi</span>
                  <span className="font-medium">{data.totalSessions} kali</span>
                </div>
              </>
            ) : null}

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
            {data?.type === "recurringBooking" ? (
              <p className="text-sm text-gray-600">
                Pemesanan berulang Anda telah berhasil dibuat. Anda dapat
                melihat jadwal detail di halaman pesanan. Tanda terima
                pembayaran telah dikirim ke email Anda.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Tanda terima pembayaran telah dikirim ke email Anda. Terima
                kasih telah melakukan pembelian.
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleBackToHome}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></span>
                Memuat...
              </span>
            ) : (
              "Kembali ke Beranda"
            )}
          </Button>
          <Button
            className="w-full bg-primary hover:bg-green-700"
            onClick={handleViewOrder}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Memuat...
              </span>
            ) : (
              "Lihat Pesanan"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
