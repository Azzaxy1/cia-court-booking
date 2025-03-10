import React from "react";
import { facilities } from "@/lib/facilities";
import Image from "next/image";
import {
  Calendar,
  Clock,
  // MapPin,
  Users,
  Award,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { facilityInfo, scheduleData } from "@/lib/detailCourt";
import SideBooking from "@/components/DetailLapangan/side-booking";

type FacilityType = "futsal" | "badminton" | "tableTennis";

const DetailLapangan = async ({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) => {
  const { type, id } = await params;

  const lapangan = facilities[type as FacilityType]?.find(
    (court) => court?.id === Number(id)
  );

  if (!lapangan) {
    return (
      <div className="container mx-auto md:px-12 py-20 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Lapangan Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Maaf, lapangan yang Anda cari tidak tersedia atau telah dihapus.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/lapangan">
              <Button>Kembali ke Daftar Lapangan</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const facilityDetails = facilityInfo[type as FacilityType];

  return (
    <div className="container mx-auto md:px-12 py-20 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri - Gambar dan Informasi Utama */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/lapangan"
              className="text-teal-700 hover:underline text-sm"
            >
              Daftar Lapangan
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 text-sm">
              {facilityDetails.title}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 text-sm font-medium">
              {lapangan.name}
            </span>
          </div>

          <h1 className="text-3xl flex-col md:flex-row md:items-center font-bold mb-4 flex items-start gap-2">
            <facilityDetails.icon className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800">
                {facilityDetails.title} - {lapangan.name}
              </span>
              {lapangan.available ? (
                <Badge className="ml-2 bg-green-500 text-white">Tersedia</Badge>
              ) : (
                <Badge className="ml-2 bg-red-500">Tidak Tersedia</Badge>
              )}
            </div>
          </h1>

          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={lapangan.image}
              alt={lapangan.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <Tabs defaultValue="informasi" className="mb-8">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="informasi">Informasi</TabsTrigger>
              <TabsTrigger value="jadwal">Jadwal & Harga</TabsTrigger>
              {/* <TabsTrigger value="ulasan">Ulasan</TabsTrigger> */}
            </TabsList>

            <TabsContent value="informasi" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi Lapangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">
                    {type === "futsal"
                      ? "Lapangan futsal dengan standar internasional, dilengkapi dengan rumput sintetis berkualitas tinggi yang nyaman untuk bermain. Fasilitas ini dirancang untuk memberikan pengalaman bermain yang maksimal bagi para pecinta futsal."
                      : type === "badminton"
                      ? "Lapangan badminton dengan lantai vinyl berkualitas premium yang memberikan traksi sempurna. Dilengkapi dengan pencahayaan anti-silau dan ruangan berpendingin untuk kenyamanan bermain sepanjang hari."
                      : "Meja tenis meja dengan standar kompetisi, ditempatkan dalam ruangan yang dirancang khusus dengan pencahayaan optimal. Ideal untuk bermain kasual maupun latihan intensif."}
                  </p>

                  <h3 className="text-lg font-semibold mb-3">
                    Fasilitas Unggulan
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {facilityDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Jam Operasional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{facilityDetails.openHours}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Kapasitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{facilityDetails.capacity}</p>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Lokasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lantai {Math.floor(Math.random() * 3) + 1}, Blok{" "}
                      {String.fromCharCode(65 + Math.floor(Math.random() * 5))}
                    </p>
                  </CardContent>
                </Card> */}
              </div>
            </TabsContent>

            <TabsContent value="jadwal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Informasi Harga
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-teal-800 mb-2">
                        Harga Standar
                      </h4>
                      <p className="text-2xl font-bold text-teal-600">
                        {lapangan.price}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Senin - Jumat
                      </p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-teal-800 mb-2">
                        Harga Akhir Pekan
                      </h4>
                      <p className="text-2xl font-bold text-teal-600">
                        {lapangan.price.replace(
                          /Rp\.\s(\d+)/,
                          (_, price) =>
                            `Rp. ${Math.floor(
                              parseInt(price) * 1.2
                            ).toLocaleString("id-ID")}`
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Sabtu - Minggu
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-2">Paket Khusus</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Paket 5 Jam: Diskon 10%</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Paket Bulanan: Diskon 20%</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Jadwal Tersedia
                  </CardTitle>
                  <CardDescription>
                    Pilih hari dan jam untuk pemesanan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    {scheduleData.map((day) => (
                      <div key={day.day} className="border rounded-lg p-2">
                        <h4 className="font-semibold text-center border-b pb-1 mb-2">
                          {day.day}
                        </h4>
                        <div className="space-y-1">
                          {day.slots.map((time) => {
                            const isAvailable = Math.random() > 0.3;
                            return (
                              <div
                                key={`${day.day}-${time}`}
                                className={`text-center py-1 text-sm rounded ${
                                  isAvailable
                                    ? "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {time}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* 
            <TabsContent value="ulasan">
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Pengguna</CardTitle>
                  <CardDescription>
                    Rating Rata-rata:
                    <span className="text-yellow-500 ml-2">
                      {"★".repeat(4.7)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - 4.7)}
                      </span>
                    </span>
                    <span className="ml-2 text-blue-600 font-semibold">
                      4.7/5
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="text-yellow-500 mb-2">
                          {"★".repeat(review.rating)}
                          <span className="text-gray-300">
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>

        <SideBooking lapangan={lapangan} />
      </div>
    </div>
  );
};

export default DetailLapangan;
