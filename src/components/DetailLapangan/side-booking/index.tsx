"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSchedule } from "@/contexts/ScheduleContext";
import { formatRupiah } from "@/lib/utils";
import { paymentMidtrans } from "@/services/mainService";
import { CourtReal } from "@/types/court";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

// Extend the Window interface to include 'snap'
declare global {
  interface Window {
    snap?: any;
  }
}

interface Props {
  court: CourtReal;
}

const SideBooking = ({ court }: Props) => {
  const { selectedSchedule } = useSchedule();
  const { data: session } = useSession();
  console.log(selectedSchedule);

  console.log(selectedSchedule);

  const clientKey = process.env.MIDTRANS_CLIENT_KEY as string;

  useEffect(() => {
    // Cek apakah script sudah ada
    if (document.getElementById("midtrans-script")) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey); // Ganti dengan client key asli
    script.id = "midtrans-script";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("midtrans-script")?.remove();
    };
  }, [clientKey]);

  const { mutate, isPending } = useMutation({
    mutationFn: paymentMidtrans,
    onSuccess: (data) => {
      console.log("Payment data:", data);
      const { token } = data;
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: function (result: Record<string, unknown>) {
            toast.success("Pesan lapangan berhasil!");
            console.log("success", result);
          },
          onPending: function (result: Record<string, unknown>) {
            console.log("pending", result);
          },
          onError: function (result: Record<string, unknown>) {
            console.log("error", result);
          },
          onClose: function () {
            console.log(
              "customer closed the popup without finishing the payment"
            );
          },
        });
      }
    },
  });

  const handleBooking = async () => {
    if (!selectedSchedule) {
      toast.error("Silakan pilih jadwal terlebih dahulu");
      return;
    }

    try {
      mutate({
        orderId: `order-${Date.now()}`,
        amount: selectedSchedule?.price,
        customerDetails: {
          first_name: session?.user?.name ?? "",
          last_name: "",
          email: session?.user?.email ?? "",
          phone: session?.user?.phone ?? "",
        },
      });
    } catch (error) {
      toast.error(
        `Terjadi kesalahan saat memproses pembayaran. ${String(error)}`
      );
    }
  };

  return (
    <div>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Pesan Lapangan</CardTitle>
          <CardDescription>Tersedia untuk pemesanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-teal-600">
              {formatRupiah(selectedSchedule?.price ?? 0)}
              <span className="text-sm text-gray-500">/per jam</span>
              {!selectedSchedule && (
                <span className="text-sm inline-block mt-2 text-gray-500">
                  Pilih jadwal terlebih dahulu untuk melihat harga
                </span>
              )}
            </h3>
          </div>

          <Button
            onClick={handleBooking}
            className="w-full mb-3"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin mr-2" size={16} />{" "}
                Memproses...
              </span>
            ) : (
              "Pesan Sekarang"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Kebijakan Pembatalan:</span> Gratis
            pembatalan hingga 24 jam sebelum jadwal
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Butuh bantuan?</span> Hubungi kami
            di 0851-8219-8144
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SideBooking;
