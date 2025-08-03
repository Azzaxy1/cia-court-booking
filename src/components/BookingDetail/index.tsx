"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah, formatSportType, formattedDate } from "@/lib/utils";
import { BookingStatus } from "@/types/Booking";
import { Court, Booking, Transaction, Schedule } from "@/app/generated/prisma";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CircleDollarSign,
  MessageCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PiCourtBasketball } from "react-icons/pi";
import { useSession } from "next-auth/react";

interface BookingDetailProps {
  booking: Booking & {
    court: Court & {
      Schedule: Schedule[];
    };
    Transaction: Transaction[];
  };
}

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-green-500 text-white">Selesai</Badge>;
    case "Canceled":
      return <Badge className="bg-red-500 text-white">Dibatalkan</Badge>;
    case "Pending":
      return (
        <Badge className="bg-yellow-500 text-white">Menunggu Pembayaran</Badge>
      );
    case "Refunded":
      return <Badge className="bg-gray-500 text-white">Dikembalikan</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">Tidak Diketahui</Badge>;
  }
};

const BookingDetail = ({ booking }: BookingDetailProps) => {
  const adminWhatsApp = "+62 813-1457-4274";
  const { data: session } = useSession();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = () => {
    const message = `Halo Admin, saya ingin melakukan reschedule untuk booking berikut:

📋 Detail Booking:
- Nama Pengguna: ${session?.user?.name || "Pengguna Tidak Dikenal"}
- Email: ${session?.user?.email || "Email Tidak Diketahui"}
- ID Booking: ${booking.id}
- Lapangan: ${booking.court.name}
- Jenis Olahraga: ${formatSportType(booking.courtType)}
- Tanggal Pemesanan: ${new Date(booking.date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })}
- Waktu Pemesanan: ${booking.startTime} - ${booking.endTime}
- Total Harga: ${booking.amount}

🔄 Permintaan perubahan jadwal:
- Tanggal Baru: ${
      newDate
        ? new Date(newDate).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })
        : "-"
    }
- Jam Mulai Baru: ${newStartTime || "-"}

Mohon bantuan untuk mengatur jadwal baru. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setShowRescheduleModal(false);
    setNewDate("");
    setNewStartTime("");
  };

  const handleContactAdmin = () => {
    const message = `Halo Admin, saya memiliki pertanyaan terkait booking ${booking.id}. Mohon bantuannya, terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Request Reschedule
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Masukkan tanggal dan jam mulai baru untuk booking Anda
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Mulai Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Durasi tetap {booking.duration} jam dari waktu mulai
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setNewDate("");
                  setNewStartTime("");
                }}
                className="px-4 py-2"
              >
                Batal
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                onClick={handleRescheduleSubmit}
                disabled={!newDate || !newStartTime}
              >
                Kirim ke Admin
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Detail Booking</h1>
          <p className="text-gray-500">#{booking.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informasi Lapangan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Informasi Lapangan
              {getStatusBadge(booking.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              <Image
                src={booking.court.image}
                alt={booking.court.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">{booking.court.name}</h3>
                  <p className="text-sm text-gray-600">
                    {booking.court.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ">
                <div className="h-5 w-5 flex items-center justify-center">
                  <PiCourtBasketball />
                </div>
                <span className="text-sm font-medium">
                  {formatSportType(booking.courtType)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Booking */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pemesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="font-medium">{formattedDate(booking.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Waktu</p>
                  <p className="font-medium">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Total Harga</p>
                  <p className="font-medium">{formatRupiah(booking.amount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium">{booking.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="font-medium">{booking.duration} Jam</p>
                </div>
              </div>
            </div>

            {booking.rescheduleCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  📅 Booking ini telah direschedule {booking.rescheduleCount}{" "}
                  kali
                </p>
              </div>
            )}

            {booking.cancelReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  ❌ Alasan Pembatalan: {booking.cancelReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informasi Transaksi */}
      {booking.Transaction && booking.Transaction.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.Transaction.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Transaksi #{index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.paymentMethod} •{" "}
                      {formatRupiah(transaction.amount)}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      transaction.status === "paid" ||
                      transaction.status === "Paid"
                        ? "bg-green-500"
                        : transaction.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } text-white`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bantuan & Aksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reschedule Button - hanya tampil jika status Paid dan belum reschedule lebih dari 2 kali */}
            {booking.status === "Paid" && booking.rescheduleCount < 2 && (
              <Button
                onClick={handleReschedule}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="h-4 w-4" />
                Request Reschedule
              </Button>
            )}

            {/* Contact Admin Button */}
            <Button
              onClick={handleContactAdmin}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Admin
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Kontak Admin</h4>
                <p className="text-sm text-green-700 mt-1">
                  WhatsApp: {adminWhatsApp}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Hubungi admin untuk bantuan terkait booking, reschedule, atau
                  pertanyaan lainnya. Admin akan merespons dalam 1x24 jam.
                </p>
              </div>
            </div>
          </div>

          {booking.rescheduleCount >= 2 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Batas maksimal reschedule (2 kali) telah tercapai. Hubungi
                admin jika masih memerlukan perubahan jadwal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDetail;
