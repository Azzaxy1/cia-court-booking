"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
} from "lucide-react";
import {
  RecurringBookingWithRelations,
  DAYS_OF_WEEK,
} from "@/types/RecurringBooking";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import "jspdf-autotable";

interface Props {
  data: RecurringBookingWithRelations[];
  columns: ColumnDef<RecurringBookingWithRelations>[];
}

const RecurringBookingsTable = ({ data, columns }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
    },
    onGlobalFilterChange: setFiltering,
  });

  // Export to PDF
  const exportToPDF = () => {
    if (safeData.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Data Pemesanan Berulang CIA Court Serang", 14, 15);

    // Summary
    doc.setFontSize(10);
    doc.text(`Total Pemesanan: ${safeData.length}`, 14, 25);
    doc.text(
      `Dicetak pada: ${format(new Date(), "d MMMM yyyy HH:mm", {
        locale: id,
      })}`,
      14,
      30
    );

    // Table
    autoTable(doc, {
      head: [
        [
          "No",
          "Pelanggan",
          "Lapangan",
          "Jadwal",
          "Periode",
          "Total Sesi",
          "Total Harga",
          "Status",
        ],
      ],
      body: safeData.map((item, index) => [
        index + 1,
        item.user?.name || "N/A",
        item.court?.name || "N/A",
        `Setiap ${DAYS_OF_WEEK[item.dayOfWeek - 1] || "N/A"} ${
          item.startTime
        }-${item.endTime}`,
        `${format(new Date(item.startDate), "d MMM yyyy", {
          locale: id,
        })} - ${format(new Date(item.endDate), "d MMM yyyy", { locale: id })}`,
        `${item.bookings?.length || 0} sesi`,
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(item.totalAmount || 0),
        item.status || "N/A",
      ]),
      startY: 40,
      headStyles: {
        fillColor: [18, 105, 120],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // No
        1: { cellWidth: 25 }, // Pelanggan
        2: { cellWidth: 25 }, // Lapangan
        3: { cellWidth: 30 }, // Jadwal
        4: { cellWidth: 30 }, // Periode
        5: { cellWidth: 20 }, // Total Sesi
        6: { cellWidth: 25 }, // Total Harga
        7: { cellWidth: 15 }, // Status
      },
    });

    const fileName = `data-pemesanan-berulang-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Cari</span>
          <Input
            placeholder="Cari pelanggan, lapangan, atau status..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={exportToPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Unduh PDF
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">
            Total Pemesanan
          </div>
          <div className="text-2xl font-bold text-primary">
            {safeData.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">Aktif</div>
          <div className="text-2xl font-bold text-green-600">
            {safeData.filter((item) => item.status === "Paid").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {safeData.filter((item) => item.status === "Pending").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">
            Total Pendapatan
          </div>
          <div className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(
              safeData
                .filter((item) => item.status === "Paid")
                .reduce((sum, item) => sum + item.totalAmount, 0)
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-primary text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data pemesanan berulang
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Halaman:</span>
            <Input
              type="number"
              value={pagination.pageIndex + 1}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Number(e.target.value) - 1,
                }))
              }
              min={1}
              max={table.getPageCount()}
              className="w-16"
            />
            <span className="text-sm text-gray-500">
              dari {table.getPageCount()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tampilkan:</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringBookingsTable;
