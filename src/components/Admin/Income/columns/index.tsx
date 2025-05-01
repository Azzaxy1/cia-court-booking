"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/Order";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer",
    header: "Pelanggan",
    cell: ({ row }) => <div>{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "date",
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
      // Format tanggal menggunakan date-fns
      const formattedDate = format(
        new Date(row.getValue("date")),
        "d MMM yyyy",
        { locale: id }
      );
      return <div>{formattedDate}</div>;
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
      // Format currency
      const amount = parseFloat(row.getValue("amount"));
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
