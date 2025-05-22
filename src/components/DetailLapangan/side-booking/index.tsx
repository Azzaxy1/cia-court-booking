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
import { paymentMidtrans } from "@/services/mainService";
import { CourtReal } from "@/types/court";
import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
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
  // const router = useRouter();

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
    try {
      mutate({
        orderId: `order-${Date.now()}`,
        amount: 150000,
        customerDetails: {
          first_name: "Azis",
          last_name: "Abdurrahman",
          email: "azis@gmail.com",
          phone: "08123456789",
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
          <CardDescription>
            {court.available
              ? "Tersedia untuk pemesanan"
              : "Saat ini sedang tidak tersedia"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-teal-600">
              Rp. 150.000{" "}
              <span className="text-sm text-gray-500">/per jam</span>
            </h3>
          </div>

          <Button
            onClick={handleBooking}
            className="w-full mb-3"
            disabled={!court.available || isPending}
          >
            {!court.available ? (
              "Tidak Tersedia"
            ) : isPending ? (
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
