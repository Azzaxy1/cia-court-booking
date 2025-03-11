import React from "react";
import { court } from "@/lib/dummy/court";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { courtInfo, scheduleData } from "@/lib/dummy/detailCourt";
import SideBooking from "@/components/DetailLapangan/side-booking";
import { Court } from "@/types/court/Court";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InformationCourt from "@/components/DetailLapangan/information-court";
import ScheduleCourt from "@/components/DetailLapangan/schedule-court";

type CourtType = "futsal" | "badminton" | "tableTennis";

const DetailLapangan = async ({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) => {
  const { type, id } = await params;

  const lapangan = court[type as CourtType]?.find(
    (item) => item?.id === Number(id)
  ) as Court;

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

  const courtDetails = courtInfo[type as CourtType];

  return (
    <div className="container mx-auto md:px-12 py-24 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri - Gambar dan Informasi Utama */}
        <div className="lg:col-span-2">
          <Breadcrumb className="flex items-center mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="lapangan"
                  className="text-teal-700 hover:underline text-sm"
                >
                  Daftar Lapangan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{courtDetails.title}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-gray-800 font-semibold">
                {lapangan.name} ({lapangan.type})
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl flex-col md:flex-row md:items-center font-bold mb-4 flex items-start gap-2">
            <courtDetails.icon className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <p className="text-2xl sm:text-3xl 2xl:text-3xl font-semibold leading-tight text-slate-800">
                {courtDetails.title} - {lapangan.name}{" "}
                <span className="text-primary">
                  {lapangan.type && `(${lapangan.type})`}
                </span>
              </p>
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
            </TabsList>

            <InformationCourt type={type} courtDetails={courtDetails} />

            <ScheduleCourt lapangan={lapangan} scheduleData={scheduleData} />
          </Tabs>
        </div>

        <SideBooking lapangan={lapangan} />
      </div>
    </div>
  );
};

export default DetailLapangan;
