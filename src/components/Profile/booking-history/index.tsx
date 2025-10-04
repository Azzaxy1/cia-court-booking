import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah, formatSportType } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  Info,
  CircleDollarSign,
  Eye,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types/Booking";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: Record<string, unknown>) => void;
          onError: (result: Record<string, unknown>) => void;
        }
      ) => void;
    };
  }
}

interface Props {
  booking: Booking;
}

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-green-500 text-white">Selesai</Badge>;
    case "Canceled":
      return <Badge className="bg-red-500 text-white">Dibatalkan</Badge>;
    case "Pending":
      return (
        <Badge className="bg-yellow-500 text-white animate-pulse">
          Belum Bayar
        </Badge>
      );
    default:
      return <Badge className="bg-gray-500 text-white">Tidak Diketahui</Badge>;
  }
};

const BookingHistory = ({ booking }: Props) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const router = useRouter();

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string;

  useEffect(() => {
    // Cek apakah script sudah ada
    if (document.getElementById("midtrans-script")) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.id = "midtrans-script";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("midtrans-script")?.remove();
    };
  }, [clientKey]);

  const handleRetryPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch("/api/payment/retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat ulang pembayaran");
      }

      // Gunakan popup Midtrans
      if (data.transactionToken && window.snap) {
        window.snap.pay(data.transactionToken, {
          onSuccess: (result) => {
            toast.success("Pembayaran berhasil!");
            router.push(`/payment/success?order_id=${result.order_id}`);
            router.refresh();
          },
          onError: (result) => {
            toast.error(
              `Pembayaran gagal! ${result?.message || "Terjadi kesalahan"}`,
              {
                duration: 3000,
              }
            );
          },
        });
      }
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error("Gagal memproses pembayaran ulang. Silakan hubungi admin.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  return (
    <Card className="overflow-hidden shadow-lg border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Gambar Lapangan */}
        <div className="relative h-48 md:h-auto md:w-1/3">
          <Image
            src={booking.court.image}
            alt={booking.court.name}
            width={400}
            height={320}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detail Booking */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{booking.court.name}</h3>
              <p className="text-sm text-gray-500">
                {formatSportType(booking.courtType)}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <p>
                <span className="font-semibold text-gray-700">Tanggal:</span>{" "}
                <span className="text-gray-600">
                  {/* Tampilkan format beserta hari  dalam js*/}
                  {new Date(booking.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <p>
                <span className="font-semibold text-gray-700">Jam:</span>{" "}
                <span className="text-gray-600">
                  {booking.startTime} - {booking.endTime}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-gray-500" />
              <p>
                <span className="font-semibold text-gray-700">Harga:</span>{" "}
                <span className="text-gray-600">
                  {formatRupiah(booking.amount)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <p>
                <span className="font-semibold text-gray-700">
                  Metode Pembayaran:
                </span>{" "}
                <span className="text-gray-600">{booking.paymentMethod}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              <p>
                <span className="font-semibold text-gray-700">Durasi:</span>{" "}
                <span className="text-gray-600">{booking.duration} Jam</span>
              </p>
            </div>
          </div>

          {/* Peringatan untuk pembayaran pending */}
          {booking.status === "Pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <div className="text-yellow-600">⚠️</div>
                <div>
                  <h4 className="font-medium text-yellow-800 text-sm">
                    Pembayaran Belum Selesai
                  </h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Selesaikan pembayaran Anda sekarang untuk mengkonfirmasi
                    booking ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 pt-4">
            {/* Tombol Bayar Sekarang - hanya tampil jika status Pending */}
            {booking.status === "Pending" && (
              <Button
                onClick={handleRetryPayment}
                disabled={isProcessingPayment}
                size="sm"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4" />
                {isProcessingPayment ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            )}

            {/* Tombol Lihat Detail */}
            <Link href={`/booking/${booking.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingHistory;
