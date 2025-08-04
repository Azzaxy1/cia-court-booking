import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah, formatSportType } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  Info,
  CircleDollarSign,
  Eye,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types/Booking";

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
        <Badge className="bg-yellow-500 text-white">Menunggu Konfirmasi</Badge>
      );
    default:
      return <Badge className="bg-gray-500 text-white">Tidak Diketahui</Badge>;
  }
};

const BookingHistory = ({ booking }: Props) => {
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

          {/* Tombol Lihat Detail */}
          <div className="flex justify-end pt-4">
            <Link href={`/booking/${booking.id}`}>
              <Button size="sm" className="flex items-center gap-2">
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
