"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Schedule, Court } from "@/app/generated/prisma";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign } from "lucide-react";
import ActionsCell from "../../ActionsCell";

interface ScheduleWithCourt extends Schedule {
  court: Court;
}

export const getColumns = (role: string): ColumnDef<ScheduleWithCourt>[] => {
  const columns: ColumnDef<ScheduleWithCourt>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "court.name",
      header: "Lapangan",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              row.original.court.type === "Futsal"
                ? "bg-green-500"
                : row.original.court.type === "Badminton"
                ? "bg-blue-500"
                : "bg-orange-500"
            }`}
          />
          <div>
            <div className="font-medium">{row.original.court.name}</div>
            <div className="text-xs text-gray-500">
              {row.original.court.type}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        const isDateToday = isToday(date);
        const isDateTomorrow = isTomorrow(date);
        const isDatePast = isPast(date);

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <div
                className={`font-medium ${
                  isDateToday
                    ? "text-blue-600"
                    : isDateTomorrow
                    ? "text-green-600"
                    : isDatePast
                    ? "text-gray-400"
                    : ""
                }`}
              >
                {format(date, "d MMMM yyyy", { locale: id })}
              </div>
              <div className="text-xs text-gray-500">
                {isDateToday
                  ? "Hari ini"
                  : isDateTomorrow
                  ? "Besok"
                  : format(date, "EEEE", { locale: id })}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "timeSlot",
      header: "Jam",
      cell: ({ row }) => {
        const timeSlot = row.getValue("timeSlot") as string;
        const hour = parseInt(timeSlot.split(":")[0]);
        const timeCategory =
          hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        const categoryColors = {
          morning: "bg-yellow-100 text-yellow-800",
          afternoon: "bg-blue-100 text-blue-800",
          evening: "bg-purple-100 text-purple-800",
        };

        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <Badge variant="outline" className={categoryColors[timeCategory]}>
              {timeSlot}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-medium">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "dayType",
      header: "Tipe Hari",
      cell: ({ row }) => {
        const dayType = row.getValue("dayType") as string;
        const dayTypeColors = {
          Weekday: "bg-blue-100 text-blue-800",
          Weekend: "bg-orange-100 text-orange-800",
          Holiday: "bg-red-100 text-red-800",
        };

        return (
          <Badge
            variant="outline"
            className={
              dayTypeColors[dayType as keyof typeof dayTypeColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {dayType}
          </Badge>
        );
      },
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ row }) => {
        const available = row.getValue("available") as boolean;
        return (
          <Badge
            variant={available ? "default" : "destructive"}
            className={
              available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {available ? "Tersedia" : "Terisi"}
          </Badge>
        );
      },
    },
  ];

  if (role === "CASHIER") {
    columns.push({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const schedule = row.original;
        return <ActionsCell id={schedule.id} isSchedule />;
      },
    });
  }

  return columns;
};
