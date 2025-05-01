"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/Order";

import ActionsCell from "../../ActionsCell";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Pelanggan",
  },
  {
    accessorKey: "fieldType",
    header: "Lapangan",
  },
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "time",
    header: "Waktu",
  },
  {
    accessorKey: "duration",
    header: "Durasi",
    cell: ({ row }) => {
      const orders = row.original;
      const duration = orders.duration;
      return <div>{duration} Jam</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="">Total Harga</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const orders = row.original;
      const status = orders.status;
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
      const orders = row.original;
      return <ActionsCell id={orders.id} isOrder />;
    },
  },
];
