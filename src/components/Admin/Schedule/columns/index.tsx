"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Schedule, Court } from "@/app/generated/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ActionsCell from "../../ActionsCell";

type ScheduleWithCourt = Schedule & { court: Court };

export const getColumns = (role: string): ColumnDef<ScheduleWithCourt>[] => {
  const columns: ColumnDef<ScheduleWithCourt>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "court.name",
      header: "Lapangan",
      cell: ({ row }) => row.original.court.name,
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
      accessorKey: "timeSlot",
      header: "Jam",
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => `Rp ${row.original.price.toLocaleString("id-ID")}`,
    },
    {
      accessorKey: "dayType",
      header: "Hari",
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ row }) => (row.original.available ? "Tersedia" : "Terisi"),
    },
  ];

  if (role === "CASHIER") {
    columns.push({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const schedule = row.original;
        return <ActionsCell id={schedule.id} isSchedule />;
      },
    });
  }

  return columns;
};
