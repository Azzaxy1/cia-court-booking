"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/app/generated/prisma";
import { DAYS_OF_WEEK } from "@/types/RecurringBooking";

export interface TransactionWithBooking extends Transaction {
  booking: {
    date: string | null | Date;
    startTime: string;
    endTime: string;
    courtType: string;
    user: {
      name: string;
    };
    court: {
      id: string;
      name: string;
      type: string;
    };
  } | null;
  recurringBooking: {
    startDate: string | Date;
    endDate: string | Date;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    courtType: string;
    user: {
      name: string;
    };
    court: {
      id: string;
      name: string;
      type: string;
    };
  } | null;
}

export interface CourtFilter {
  id: string;
  name: string;
  type: string;
}

export const columns: ColumnDef<TransactionWithBooking>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "booking.user.name",
    header: "Pelanggan",
    cell: ({ row }) => {
      const booking = row.original.booking;
      const recurringBooking = row.original.recurringBooking;
      return (
        <div>{booking?.user.name || recurringBooking?.user.name || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "booking.court.name",
    header: "Lapangan",
    cell: ({ row }) => {
      const booking = row.original.booking;
      const recurringBooking = row.original.recurringBooking;
      return (
        <div>
          {booking?.court.name || recurringBooking?.court.name || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "booking.courtType",
    header: "Tipe Lapangan",
    cell: ({ row }) => {
      const booking = row.original.booking;
      const recurringBooking = row.original.recurringBooking;
      const type =
        booking?.courtType ||
        booking?.court.type ||
        recurringBooking?.court.type;
      const typeMap = {
        Futsal: "Futsal",
        Badminton: "Badminton",
        TenisMeja: "Tenis Meja",
      };
      return (
        <div>
          {type ? typeMap[type as keyof typeof typeMap] || type : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "booking.date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const booking = row.original.booking;
      const recurringBooking = row.original.recurringBooking;

      if (booking?.date) {
        const date = new Date(booking.date);
        return <div>{format(date, "d MMM yyyy", { locale: id })}</div>;
      }

      if (recurringBooking?.startDate) {
        const dayName = DAYS_OF_WEEK[recurringBooking.dayOfWeek - 1];
        return <div>Setiap {dayName}</div>;
      }

      return <div>-</div>;
    },
  },
  {
    accessorKey: "booking.timeSlot",
    header: "Jam Bermain",
    cell: ({ row }) => {
      const booking = row.original.booking;
      const recurringBooking = row.original.recurringBooking;

      if (booking) {
        const { startTime, endTime } = booking;
        return (
          <div>
            {startTime} - {endTime}
          </div>
        );
      }

      if (recurringBooking) {
        const { startTime, endTime } = recurringBooking;
        return (
          <div>
            {startTime} - {endTime}
          </div>
        );
      }

      return <div>N/A</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jumlah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
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
    accessorKey: "paymentMethod",
    header: "Metode Pembayaran",
    cell: ({ row }) => <div>{row.getValue("paymentMethod")}</div>,
  },
];
