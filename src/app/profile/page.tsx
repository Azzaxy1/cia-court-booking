import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  LogOut,
  User,
  Bell,
  CreditCard,
  History,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { images } from "@/assets";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

// Data dummy untuk histori pemesanan
const bookingHistory = [
  {
    id: "BK-24578",
    facilityName: "Lapangan Futsal 2",
    facilityType: "futsal",
    date: "5 Maret 2025",
    time: "18:00 - 20:00",
    status: "completed",
    price: "Rp. 200.000",
    image: images.Futsal,
  },
  {
    id: "BK-24123",
    facilityName: "Lapangan Badminton 1",
    facilityType: "badminton",
    date: "28 Februari 2025",
    time: "19:00 - 21:00",
    status: "completed",
    price: "Rp. 150.000",
    image: images.Badminton,
  },
  {
    id: "BK-24892",
    facilityName: "Lapangan Tenis Meja 1",
    facilityType: "tableTennis",
    date: "10 Maret 2025",
    time: "16:00 - 18:00",
    status: "upcoming",
    price: "Rp. 100.000",
    image: images.TenisMeja,
  },
];

const ProfilePage = () => {
  // Data dummy untuk user
  const user = {
    name: "Abdurrohman Azis",
    email: "abdurrohmanazis@email.com",
    phone: "081234567890",
    profilePicture: null, // Ganti dengan URL foto profil jika ada
  };

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
        return (
          <Badge className="bg-gray-500 text-white">Tidak Diketahui</Badge>
        );
    }
  };

  // Format nama sport
  const formatSportType = (type: string) => {
    switch (type) {
      case "futsal":
        return "Futsal";
      case "badminton":
        return "Badminton";
      case "tableTennis":
        return "Tenis Meja";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto md:px-12 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Profil */}
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">Profil Saya</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <Avatar className="h-24 w-24 mb-4">
                {user.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" /> Keluar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MdEmail className="h-5 w-5 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Konten Utama */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="bookings">Pemesanan</TabsTrigger>
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            </TabsList>

            {/* Tab Pemesanan */}
            <TabsContent value="bookings">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Riwayat Pemesanan</h2>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" /> Lihat Semua
                </Button>
              </div>

              <div className="space-y-4">
                {bookingHistory.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-1/3">
                        <div className="w-full h-full bg-gray-200">
                          <Image
                            src={booking.image}
                            alt={booking.facilityName}
                            width={400}
                            height={320}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold">
                              {booking.facilityName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatSportType(booking.facilityType)}
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
                ))}
              </div>
            </TabsContent>

            {/* Tab Pengaturan */}
            <TabsContent value="profile">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Akun</CardTitle>
                    <CardDescription>
                      Perbarui informasi profil dan keamanan akun Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          defaultValue={user.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 border rounded-md"
                          defaultValue={user.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          className="w-full p-2 border rounded-md"
                          defaultValue={user.phone}
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button>Simpan Perubahan</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
