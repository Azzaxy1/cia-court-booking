"use client";
import { ColumnDef } from "@tanstack/react-table";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { Booking } from "@/app/generated/prisma";
import ActionsCell from "../../ActionsCell";

export interface BookingWithUser extends Booking {
  user: {
    name: string;
    email?: string;
  };
  court: {
    name: string;
  };
}

export const getColumns = (role: string): ColumnDef<BookingWithUser>[] => {
  const columns: ColumnDef<BookingWithUser>[] = [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "user",
      header: "Pelanggan",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          {row.original.user.email && (
            <div className="text-xs text-gray-500">
              {row.original.user.email}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "court",
      header: "Lapangan",
      cell: ({ row }) => <div>{row.original.court.name}</div>,
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
        // Tampilkan hari nya juga
        return (
          <div>
            {format(new Date(date), "dd MMMM yyyy", { locale: id })}{" "}
            <span className="text-xs text-gray-500">
              ({format(new Date(date), "EEEE", { locale: id })})
            </span>
          </div>
        );
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
  ];

  if (role === "CASHIER") {
    columns.push({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const booking = row.original;
        return <ActionsCell id={booking.id} isOrder />;
      },
    });
  }

  return columns;
};
