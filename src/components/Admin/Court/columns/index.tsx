"use client";
import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import ActionsCell from "../../ActionsCell";
import { Court } from "@/app/generated/prisma";

export const getColumns = (role: string): ColumnDef<Court>[] => {
  const columns: ColumnDef<Court>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Nama Lapangan",
    },
    {
      accessorKey: "type",
      header: "Jenis",
    },
    {
      accessorKey: "image",
      header: "Gambar",
      cell: ({ row }) => {
        const court = row.original;
        return (
          <Image
            src={court.image}
            alt={court.name}
            width={100}
            height={100}
            className="w-16 h-16 object-cover rounded"
          />
        );
      },
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
    },
    {
      accessorKey: "surfaceType",
      header: "Tipe Permukaan",
      cell: ({ row }) => {
        const court = row.original;
        return <div>{court.surfaceType ? court.surfaceType : "-"}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: "Kapasitas",
      cell: ({ row }) => {
        const court = row.original;
        return <div>{court.capacity}</div>;
      },
    },
  ];

  if (role === "CASHIER") {
    columns.push({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const court = row.original;
        return <ActionsCell id={court.id} />;
      },
    });
  }

  return columns;
};
