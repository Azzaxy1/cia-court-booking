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
import { CourtReal } from "@/types/court";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface Props {
  court: CourtReal;
}

const SideBooking = ({ court }: Props) => {
  const router = useRouter();

  const handleBooking = () => {
    router.push("/payment/success?orderId=123124&amount=150.000");
    toast.success("Pesan lapangan berhasil!");
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
              Rp. 14.000 <span className="text-sm text-gray-500">/per jam</span>
            </h3>
          </div>

          <Button
            onClick={handleBooking}
            className="w-full mb-3"
            disabled={!court.available}
          >
            {court.available ? "Pesan Sekarang" : "Tidak Tersedia"}
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
