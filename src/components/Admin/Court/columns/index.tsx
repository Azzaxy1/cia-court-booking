"use client";
import { ColumnDef } from "@tanstack/react-table";

// import ActionsCell from "../../ActionsCell";
import { CourtReal } from "@/types/court";
import Image from "next/image";
import ActionsCell from "../../ActionsCell";

export const columns: ColumnDef<CourtReal>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Lapangan",
  },
  {
    accessorKey: "type",
    header: "Tipe",
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
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const court = row.original;
      const price = court.price;
      return (
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Weekday</div>
          <div className="flex gap-2">
            <div>Pagi: {price.Weekday.Pagi}</div>
            <div>Siang: {price.Weekday.Siang}</div>
            <div>Sore: {price.Weekday.Sore}</div>
          </div>
          <div className="font-semibold">Weekend</div>
          <div className="flex gap-2">
            <div>Pagi: {price.Weekend.Pagi}</div>
            <div>Siang: {price.Weekend.Siang}</div>
            <div>Sore: {price.Weekend.Sore}</div>
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const court = row.original;
      return <ActionsCell id={court.id} />;
    },
  },
];
