"use client";

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
import { Calendar as CalenderIcon, DollarSign } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Schedule } from "@/app/generated/prisma";
import { getCourtSchedule } from "@/services/mainService";
import { useQuery } from "@tanstack/react-query";
import { useSchedule } from "@/contexts/ScheduleContext";

interface Props {
  court: CourtReal;
}

const ScheduleCourt = ({ court }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { selectedSchedule, setSelectedSchedule } = useSchedule();

  const handleScheduleClick = (schedule: Schedule) => {
    if (schedule.available) {
      setSelectedSchedule(schedule);
    }
  };

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["schedules", court.id, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const res = await getCourtSchedule(court.id, formattedDate);
      return res.data;
    },
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (scheduleData) {
      setSchedules(scheduleData);
    }
  }, [scheduleData]);

  // Get booking status for time slot
  const getTimeSlotStatus = (time: string) => {
    const schedule = schedules.find((s) => s.timeSlot === time);
    if (!schedule) return "available";
    if (!schedule.available) return "booked";
    return "available";
  };

  const rangeMinPriceWeekday = Math.min(
    ...(
      court?.Schedule?.filter((price) => price.dayType === "Weekday") ?? []
    ).map((price) => price?.price)
  );

  const rangeMaxPriceWeekday = Math.max(
    ...(
      court?.Schedule?.filter((price) => price.dayType === "Weekday") ?? []
    ).map((price) => price?.price)
  );

  const rangeMinPriceWeekend = Math.min(
    ...(
      court?.Schedule?.filter((price) => price.dayType === "Weekend") ?? []
    ).map((price) => price?.price)
  );

  const rangeMaxPriceWeekend = Math.max(
    ...(
      court?.Schedule?.filter((price) => price.dayType === "Weekend") ?? []
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
            <CalenderIcon className="h-5 w-5" />
            Jadwal Tersedia
          </CardTitle>
          <CardDescription>
            Pilih tanggal dan jam untuk pemesanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full md:w-1/2 mx-auto"
              disabled={(date) => date < new Date()}
              initialFocus={true}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Memuat jadwal...</p>
            </div>
          ) : selectedDate ? (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {schedules.map((schedule) => {
                const status = getTimeSlotStatus(schedule.timeSlot);
                const isSelected = selectedSchedule?.id === schedule.id;
                return (
                  <div
                    key={schedule.id}
                    onClick={() => handleScheduleClick(schedule)}
                    className={`text-center py-1 text-sm rounded cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-teal-500 text-white"
                        : status === "available"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {schedule.timeSlot}
                    <div className="text-xs text-gray-500">
                      {formatRupiah(schedule.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              Silakan pilih tanggal untuk melihat jadwal yang tersedia.
            </p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ScheduleCourt;
