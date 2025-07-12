"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Court } from "@/app/generated/prisma";
import ActionsCell from "../../ActionsCell";
import { MapPin, Users, Grid3X3 } from "lucide-react";

export const getColumns = (role: string): ColumnDef<Court>[] => {
  const columns: ColumnDef<Court>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Lapangan",
      cell: ({ row }) => {
        const court = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                court.type === "Futsal"
                  ? "bg-green-500"
                  : court.type === "Badminton"
                  ? "bg-blue-500"
                  : court.type === "TenisMeja"
                  ? "bg-orange-500"
                  : "bg-gray-500"
              }`}
            />
            <div>
              <div className="font-medium">{court.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>ID: {court.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Jenis",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const typeColors = {
          Futsal: "bg-green-100 text-green-800",
          Badminton: "bg-blue-100 text-blue-800",
          TenisMeja: "bg-orange-100 text-orange-800",
        };

        return (
          <Badge
            variant="outline"
            className={
              typeColors[type as keyof typeof typeColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {type === "TenisMeja" ? "Tenis Meja" : type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Gambar",
      cell: ({ row }) => {
        const court = row.original;
        return (
          <div className="relative">
            <Image
              src={court.image}
              alt={court.name}
              width={100}
              height={100}
              className="w-16 h-16 object-cover rounded-lg border"
            />
            {court.isDeleted && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-xs text-red-700 font-medium">
                  Nonaktif
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[250px]">
            <p className="text-sm truncate" title={description}>
              {description || "-"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "surfaceType",
      header: "Permukaan",
      cell: ({ row }) => {
        const surfaceType = row.getValue("surfaceType") as string;
        return (
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{surfaceType || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Kapasitas",
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as number;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{capacity}</span>
            <span className="text-xs text-gray-500">orang</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const court = row.original;
        return (
          <Badge
            variant={court.isDeleted ? "destructive" : "default"}
            className={
              court.isDeleted
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }
          >
            {court.isDeleted ? "Nonaktif" : "Aktif"}
          </Badge>
        );
      },
    },
  ];

  if (role === "ADMIN" || role === "CASHIER") {
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
