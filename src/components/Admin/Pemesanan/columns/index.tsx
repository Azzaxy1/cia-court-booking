"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Booking } from "@/app/generated/prisma";

import ActionsCell from "../../ActionsCell";

export interface BookingWithUser extends Booking {
  user: {
    name: string;
  };
  court: {
    name: string;
  };
}

export const columns: ColumnDef<BookingWithUser>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "user",
    header: "Pelanggan",
    cell: ({ row }) => {
      const booking = row.original;
      return <div>{booking.user.name}</div>;
    },
  },
  {
    accessorKey: "court",
    header: "Lapangan",
    cell: ({ row }) => {
      const booking = row.original;
      return <div>{booking.court.name}</div>;
    },
  },
  {
    accessorKey: "courtType",
    header: "Jenis Lapangan",
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return <div>{format(date, "d MMMM yyyy", { locale: id })}</div>;
    },
  },
  {
    accessorKey: "startTime",
    header: "Waktu Mulai",
  },
  {
    accessorKey: "duration",
    header: "Durasi",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return <div>{duration} Jam</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="">Total Harga</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${
            status === "Paid"
              ? "bg-green-200 text-green-800"
              : status === "Pending"
              ? "bg-yellow-200 text-yellow-800"
              : status === "Cancelled"
              ? "bg-red-200 text-red-800"
              : "bg-blue-200 text-blue-800"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const booking = row.original;
      return <ActionsCell id={booking.id} isOrder />;
    },
  },
];
