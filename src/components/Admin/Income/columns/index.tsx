"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/app/generated/prisma";

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
      return <div>{row.original.booking?.user.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "booking.court.name",
    header: "Lapangan",
    cell: ({ row }) => {
      return <div>{row.original.booking?.court.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "booking.courtType",
    header: "Tipe Lapangan",
    cell: ({ row }) => {
      const type = row.original.booking?.courtType;
      const typeMap = {
        Futsal: "Futsal",
        Badminton: "Badminton",
        TenisMeja: "Tenis Meja",
      };
      return <div>{type ? (typeMap[type as keyof typeof typeMap] || type) : "N/A"}</div>;
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
      const date = booking?.date ? new Date(booking.date) : null;
      return (
        <div>{date ? format(date, "d MMM yyyy", { locale: id }) : "-"}</div>
      );
    },
  },
  {
    accessorKey: "booking.timeSlot",
    header: "Jam Bermain",
    cell: ({ row }) => {
      const booking = row.original.booking;
      if (!booking) return <div>N/A</div>;
      
      const { startTime, endTime } = booking;
      return (
        <div>
          {startTime} - {endTime}
        </div>
      );
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap = {
        settlement: "Paid",
        capture: "Paid",
        paid: "Paid",
        pending: "Pending",
        expire: "Expired",
        cancel: "Canceled",
      };
      return (
        <div className="capitalize">
          {statusMap[status as keyof typeof statusMap] || status}
        </div>
      );
    },
  },
];
