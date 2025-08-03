"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  RecurringBookingWithRelations,
  DAYS_OF_WEEK,
} from "@/types/RecurringBooking";

export const columns: ColumnDef<RecurringBookingWithRelations>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pelanggan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user.name}</div>
        {row.original.user.email && (
          <div className="text-xs text-gray-500">{row.original.user.email}</div>
        )}
        {row.original.user.phone && (
          <div className="text-xs text-gray-500">{row.original.user.phone}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "court.name",
    header: "Lapangan",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.court.name}</div>
        <div className="text-xs text-gray-500">
          {row.original.court.type === "TenisMeja"
            ? "Tenis Meja"
            : row.original.court.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dayOfWeek",
    header: "Jadwal Berulang",
    cell: ({ row }) => {
      const dayName = DAYS_OF_WEEK[row.original.dayOfWeek - 1];
      return (
        <div>
          <div className="font-medium">Setiap {dayName}</div>
          <div className="text-xs text-gray-500">
            {row.original.startTime} - {row.original.endTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Periode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="text-sm">
          {format(new Date(row.original.startDate), "d MMM yyyy", {
            locale: id,
          })}
        </div>
        <div className="text-xs text-gray-500">s/d</div>
        <div className="text-sm">
          {format(new Date(row.original.endDate), "d MMM yyyy", { locale: id })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "bookings",
    header: "Total Sesi",
    cell: ({ row }) => {
      const totalSessions = row.original.bookings.length;

      return (
        <div className="text-center">
          <div className="font-medium">{totalSessions} sesi</div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Harga
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        Pending: "bg-yellow-200 text-yellow-800",
        Paid: "bg-green-200 text-green-800",
        Cancelled: "bg-red-200 text-red-800",
        Expired: "bg-gray-200 text-gray-800",
      };

      return (
        <div
          className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
            statusColors[status as keyof typeof statusColors] ||
            "bg-blue-200 text-blue-800"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.createdAt), "d MMM yyyy HH:mm", {
          locale: id,
        })}
      </div>
    ),
  },
];

// Export with alias for clarity
export const recurringBookingsColumns = columns;
