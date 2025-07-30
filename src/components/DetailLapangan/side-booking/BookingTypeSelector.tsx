"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourtReal } from "@/types/court";
import { useState } from "react";
import SideBooking from "../side-booking";
import RecurringBooking from "./RecurringBooking";

interface Props {
  court: CourtReal;
}

type BookingType = "single" | "recurring";

const BookingTypeSelector = ({ court }: Props) => {
  const [bookingType, setBookingType] = useState<BookingType>("single");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Jenis Pemesanan</CardTitle>
          <CardDescription>
            Pilih apakah Anda ingin memesan sekali atau berulang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                bookingType === "single"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setBookingType("single")}
            >
              <input
                type="radio"
                value="single"
                checked={bookingType === "single"}
                onChange={() => setBookingType("single")}
                className="w-4 h-4 text-teal-600"
              />
              <div className="flex-1">
                <div className="font-semibold">Pemesanan Sekali</div>
                <div className="text-sm text-gray-500">
                  Pesan lapangan untuk satu waktu tertentu
                </div>
              </div>
            </div>

            <div
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                bookingType === "recurring"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setBookingType("recurring")}
            >
              <input
                type="radio"
                value="recurring"
                checked={bookingType === "recurring"}
                onChange={() => setBookingType("recurring")}
                className="w-4 h-4 text-teal-600"
              />
              <div className="flex-1">
                <div className="font-semibold">Pemesanan Berulang</div>
                <div className="text-sm text-gray-500">
                  Pesan lapangan untuk hari dan jam yang sama setiap minggu
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {bookingType === "single" ? (
        <SideBooking court={court} />
      ) : (
        <RecurringBooking court={court} />
      )}
    </div>
  );
};

export default BookingTypeSelector;
