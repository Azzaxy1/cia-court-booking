import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatSportType } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Calendar, Clock, CreditCard, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IBookingHistory } from "@/types/BookingHistory";

// Status badges dengan warna yang berbeda
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500 text-white">Selesai</Badge>;
    case "upcoming":
      return <Badge className="bg-blue-500 text-white">Akan Datang</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500 text-white">Dibatalkan</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">Tidak Diketahui</Badge>;
  }
};

const BookingHistory = ({ booking }: { booking: IBookingHistory }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/3">
          <div className="w-full h-full bg-gray-200">
            <Image
              src={booking.image}
              alt={booking.courtName}
              width={400}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold">{booking.courtName}</h3>
              <p className="text-sm text-gray-500">
                {formatSportType(booking.courtType)}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span>{booking.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-gray-500" />
              <span>No. {booking.id}</span>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            {booking.status === "completed" ? (
              <>
                <Button variant="outline" size="sm">
                  Pesan Lagi
                </Button>
              </>
            ) : booking.status === "upcoming" ? (
              <>
                <Button variant="default" size="sm">
                  Lihat Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  Batalkan
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingHistory;
