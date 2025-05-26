"use client";
import { ColumnDef } from "@tanstack/react-table";

// import ActionsCell from "../../ActionsCell";
import { CourtReal } from "@/types/court";
import Image from "next/image";
import ActionsCell from "../../ActionsCell";

export const columns: ColumnDef<CourtReal>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
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

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const court = row.original;
      return <ActionsCell id={court.id} />;
    },
  },
];
