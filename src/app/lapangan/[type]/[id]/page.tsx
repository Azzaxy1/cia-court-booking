import React from "react";
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
import Link from "next/link";
import { courtInfo } from "@/lib/dummy/detailCourt";
import BookingTypeSelector from "@/components/DetailLapangan/side-booking/BookingTypeSelector";
import { CourtReal } from "@/types/court/Court";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import dynamic from "next/dynamic";
import { getCourtWithSchedule } from "@/lib/db";
import { ScheduleProvider } from "@/contexts/ScheduleContext";

type CourtType = "futsal" | "badminton" | "tableTennis";

interface DetailLapanganProps {
  params: Promise<{ type: string; id: string }>;
}

const InformationCourt = dynamic(
  () => import("@/components/DetailLapangan/information-court"),
);
const ScheduleCourt = dynamic(
  () => import("@/components/DetailLapangan/schedule-court"),
);

const DetailLapangan = async ({
  params,
}: DetailLapanganProps) => {
  const courts = await getCourtWithSchedule();

  const { type, id } = await params;

  const court = courts.find((court: CourtReal) => court.id === id);

  if (!court) {
    return (
      <div className="container mx-auto md:px-12 pt-20 min-h-screen flex items-center justify-center">
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
    <ScheduleProvider>
      <div className="container mx-auto md:px-12 pt-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Gambar dan Informasi Utama */}
          <div className="lg:col-span-2">
            <Breadcrumb className="flex items-center mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/lapangan"
                    className="text-teal-700 hover:underline text-sm"
                  >
                    Daftar Lapangan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{courtDetails.title}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-gray-800 font-semibold">
                  {court.name}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl flex-col md:flex-row md:items-center font-bold mb-4 flex items-start gap-2">
              <courtDetails.icon className="h-5 w-5" />
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl 2xl:text-3xl font-semibold leading-tight text-slate-800">
                  {court.name}
                  <span className="text-primary">
                    {court.surfaceType && `(${court.surfaceType})`}
                  </span>
                </p>
              </div>
            </h1>

            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={court.image}
                alt={court.name}
                fill
                priority
                className="object-cover rounded-lg"
              />
            </div>

            <Tabs defaultValue="informasi" className="mb-8">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="informasi">Informasi</TabsTrigger>
                <TabsTrigger value="jadwal">Jadwal & Harga</TabsTrigger>
              </TabsList>

              <InformationCourt courtDetails={courtDetails} court={court} />

              <ScheduleCourt court={court} />
            </Tabs>
          </div>

          <BookingTypeSelector court={court} />
        </div>
      </div>
    </ScheduleProvider>
  );
};

export default DetailLapangan;
