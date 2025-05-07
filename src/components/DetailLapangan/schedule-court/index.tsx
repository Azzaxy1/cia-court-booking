import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/utils";
import { CourtReal } from "@/types/court";
import { Calendar, DollarSign } from "lucide-react";
import React from "react";

interface ScheduleCourtProps {
  court: CourtReal;
  scheduleData: { day: string; slots: string[] }[];
}

const ScheduleCourt = ({ court, scheduleData }: ScheduleCourtProps) => {
  const rangeMinPriceWeekday = Math.min(
    ...(
      court?.prices?.filter((price) => price.dayType === "Weekday") ?? []
    ).map((price) => price?.price)
  );

  const rangeMaxPriceWeekday = Math.max(
    ...(
      court?.prices?.filter((price) => price.dayType === "Weekday") ?? []
    ).map((price) => price?.price)
  );

  const rangeMinPriceWeekend = Math.min(
    ...(
      court?.prices?.filter((price) => price.dayType === "Weekend") ?? []
    ).map((price) => price?.price)
  );

  const rangeMaxPriceWeekend = Math.max(
    ...(
      court?.prices?.filter((price) => price.dayType === "Weekend") ?? []
    ).map((price) => price?.price)
  );
  return (
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
                Harga Hari Kerja
              </h4>
              <p className="text-2xl font-bold text-teal-600">
                {formatRupiah(rangeMinPriceWeekday ?? 0)} -{" "}
                {formatRupiah(rangeMaxPriceWeekday ?? 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Senin - Jumat</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-2">
                Harga Akhir Pekan
              </h4>
              <p className="text-2xl font-bold text-teal-600">
                {formatRupiah(rangeMinPriceWeekend ?? 0)} -{" "}
                {formatRupiah(rangeMaxPriceWeekend ?? 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Sabtu - Minggu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Tersedia
          </CardTitle>
          <CardDescription>Pilih hari dan jam untuk pemesanan</CardDescription>
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
  );
};

export default ScheduleCourt;
