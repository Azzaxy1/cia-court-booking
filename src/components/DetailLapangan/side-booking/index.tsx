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
import { Court } from "@/types/court/Court";
import React from "react";
import toast from "react-hot-toast";

const SideBooking = ({ lapangan }: { lapangan: Court }) => {
  const handleBooking = () => {
    toast.success("Pesan lapangan dengan harga " + lapangan.price + " per jam");
  };

  return (
    <div>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Pesan Lapangan</CardTitle>
          <CardDescription>
            {lapangan.available
              ? "Tersedia untuk pemesanan"
              : "Saat ini sedang tidak tersedia"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-teal-600">
              {lapangan.price}
            </h3>
            <p className="text-sm text-gray-500">per jam</p>
          </div>

          <div className="space-y-3 mb-6">
            {/* <div className="flex justify-between">
                  <span>Fasilitas</span>
                  <span className="font-medium">Premium</span>
                </div> */}
            <div className="flex justify-between">
              <span>Peralatan</span>
              <span className="font-medium">Tersedia</span>
            </div>
            <div className="flex justify-between">
              <span>Kebersihan</span>
              <span className="font-medium">Dibersihkan Setiap Hari</span>
            </div>
          </div>

          <Button
            onClick={handleBooking}
            className="w-full mb-3"
            disabled={!lapangan.available}
          >
            {lapangan.available ? "Pesan Sekarang" : "Tidak Tersedia"}
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
