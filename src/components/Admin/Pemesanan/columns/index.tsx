"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Order } from "@/types/Order";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    accessorKey: "totalPrice",
    header: () => <div className="">Total Harga</div>,
    cell: ({ row }) => {
      const totalPrice = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalPrice);
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

      const handleDelete = () => {
        console.log("Delete order", orders.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <Link href={`/admin/pemesanan/edit/${orders.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
