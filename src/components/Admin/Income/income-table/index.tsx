// components/Admin/Income/income-table/index.tsx
"use client";
import React, { useMemo, useState } from "react";
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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { TransactionWithBooking, CourtFilter } from "../columns";
import { DateRange } from "react-day-picker";

interface Props {
  data: TransactionWithBooking[];
  columns: ColumnDef<TransactionWithBooking>[];
  courts: CourtFilter[];
}

interface FilterState {
  period: string;
  courtId: string;
  courtType: string;
  timeSlot: string;
  dateRange: DateRange | undefined;
}

const IncomeTable = ({ data, columns, courts }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterState>({
    period: "all",
    courtId: "all",
    courtType: "all",
    timeSlot: "all",
    dateRange: undefined,
  });

  // Get unique court types
  const courtTypes = useMemo(() => {
    const types = new Set(courts.map((court) => court.type));
    return Array.from(types);
  }, [courts]);

  // Get unique time slots
  const timeSlots = useMemo(() => {
    const slots = new Set(
      data
        .filter((item) => item.booking) // Filter out items without booking
        .map((item) => `${item.booking!.startTime}-${item.booking!.endTime}`)
    );
    return Array.from(slots).sort();
  }, [data]);

  // Advanced filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];
    const now = new Date();

    // Period filter
    if (filters.period !== "all") {
      switch (filters.period) {
        case "this-month":
          filtered = filtered.filter(
            (item) =>
              item.booking?.date &&
              new Date(item.booking.date) >= startOfMonth(now) &&
              new Date(item.booking.date) <= endOfMonth(now)
          );
          break;
        case "last-month":
          const lastMonth = subMonths(now, 1);
          filtered = filtered.filter(
            (item) =>
              item.booking?.date &&
              new Date(item.booking.date) >= startOfMonth(lastMonth) &&
              new Date(item.booking.date) <= endOfMonth(lastMonth)
          );
          break;
        case "this-year":
          filtered = filtered.filter(
            (item) =>
              item.booking?.date &&
              new Date(item.booking.date) >= startOfYear(now) &&
              new Date(item.booking.date) <= endOfYear(now)
          );
          break;
      }
    }

    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(
        (item) =>
          item.booking?.date &&
          isWithinInterval(new Date(item.booking.date), {
            start: startOfDay(filters.dateRange!.from!),
            end: endOfDay(filters.dateRange!.to!),
          })
      );
    }

    // Court filter
    if (filters.courtId !== "all") {
      filtered = filtered.filter(
        (item) => item.booking?.court.id === filters.courtId
      );
    }

    // Court type filter
    if (filters.courtType !== "all") {
      filtered = filtered.filter(
        (item) => item.booking?.courtType === filters.courtType
      );
    }

    // Time slot filter
    if (filters.timeSlot !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.booking &&
          `${item.booking.startTime}-${item.booking.endTime}` ===
          filters.timeSlot
      );
    }

    return filtered;
  }, [data, filters]);

  const table = useReactTable({
    data: filteredData,
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

  // Calculate totals
  const totalIncome = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [filteredData]);

  // Stats by court type
  const statsByType = useMemo(() => {
    const stats: Record<string, { count: number; revenue: number }> = {};

    filteredData.forEach((item) => {
      const type = item.booking?.courtType || "Unknown";
      if (!stats[type]) {
        stats[type] = { count: 0, revenue: 0 };
      }
      stats[type].count += 1;
      stats[type].revenue += Number(item.amount);
    });

    return stats;
  }, [filteredData]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      period: "all",
      courtId: "all",
      courtType: "all",
      timeSlot: "all",
      dateRange: undefined,
    });
    setFiltering("");
  };

  // Enhanced PDF export with filters
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Laporan Pemasukan CIA Court Serang", 14, 15);

    // Filter info
    doc.setFontSize(10);
    let yPos = 25;

    doc.text("Filter yang Diterapkan:", 14, yPos);
    yPos += 5;

    if (filters.period !== "all") {
      const periodMap = {
        "this-month": "Bulan Ini",
        "last-month": "Bulan Lalu",
        "this-year": "Tahun Ini",
      };
      doc.text(
        `• Periode: ${periodMap[filters.period as keyof typeof periodMap]}`,
        16,
        yPos
      );
      yPos += 4;
    }

    if (filters.courtId !== "all") {
      const court = courts.find((c) => c.id === filters.courtId);
      doc.text(`• Lapangan: ${court?.name}`, 16, yPos);
      yPos += 4;
    }

    if (filters.courtType !== "all") {
      const typeMap = {
        Futsal: "Futsal",
        Badminton: "Badminton",
        TenisMeja: "Tenis Meja",
      };
      doc.text(
        `• Tipe Lapangan: ${
          typeMap[filters.courtType as keyof typeof typeMap]
        }`,
        16,
        yPos
      );
      yPos += 4;
    }

    if (filters.timeSlot !== "all") {
      doc.text(`• Jam Bermain: ${filters.timeSlot}`, 16, yPos);
      yPos += 4;
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      doc.text(
        `• Rentang Tanggal: ${format(filters.dateRange.from, "d MMM yyyy", {
          locale: id,
        })} - ${format(filters.dateRange.to, "d MMM yyyy", { locale: id })}`,
        16,
        yPos
      );
      yPos += 4;
    }

    yPos += 5;

    // Summary stats
    doc.text("Ringkasan:", 14, yPos);
    yPos += 5;
    doc.text(`• Total Transaksi: ${filteredData.length}`, 16, yPos);
    yPos += 4;
    doc.text(
      `• Total Pemasukan: ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(totalIncome)}`,
      16,
      yPos
    );
    yPos += 8;

    // Stats by type
    if (Object.keys(statsByType).length > 0) {
      doc.text("Pemasukan per Tipe Lapangan:", 14, yPos);
      yPos += 5;

      Object.entries(statsByType).forEach(([type, stats]) => {
        const typeMap = {
          Futsal: "Futsal",
          Badminton: "Badminton",
          TenisMeja: "Tenis Meja",
        };
        doc.text(
          `• ${typeMap[type as keyof typeof typeMap] || type}: ${
            stats.count
          } transaksi - ${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(stats.revenue)}`,
          16,
          yPos
        );
        yPos += 4;
      });
      yPos += 5;
    }

    // Table
    autoTable(doc, {
      head: [
        [
          "No",
          "Pelanggan",
          "Lapangan",
          "Tipe",
          "Tanggal",
          "Jam",
          "Jumlah",
          "Metode",
        ],
      ],
      body: filteredData
        .filter((item) => item.booking) // Only include items with booking for PDF
        .map((item, index) => [
          index + 1,
          item.booking!.user.name,
          item.booking!.court.name,
          item.booking!.courtType === "TenisMeja"
            ? "Tenis Meja"
            : item.booking!.courtType,
          format(new Date(item.createdAt), "d MMM yyyy", { locale: id }),
          `${item.booking!.startTime}-${item.booking!.endTime}`,
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Number(item.amount)),
        item.paymentMethod,
      ]),
      startY: yPos,
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
        3: { cellWidth: 20 }, // Tipe
        4: { cellWidth: 20 }, // Tanggal
        5: { cellWidth: 15 }, // Jam
        6: { cellWidth: 25 }, // Jumlah
        7: { cellWidth: 20 }, // Metode
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Dicetak pada: ${format(new Date(), "d MMMM yyyy HH:mm", {
          locale: id,
        })}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    const fileName = `laporan-pemasukan-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filter Laporan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Period Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Periode
            </label>
            <Select
              value={filters.period}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, period: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="this-month">Bulan Ini</SelectItem>
                <SelectItem value="last-month">Bulan Lalu</SelectItem>
                <SelectItem value="this-year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Court Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Lapangan
            </label>
            <Select
              value={filters.courtId}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, courtId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lapangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lapangan</SelectItem>
                {courts.map((court) => (
                  <SelectItem key={court.id} value={court.id}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Court Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Tipe Lapangan
            </label>
            <Select
              value={filters.courtType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, courtType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {courtTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "TenisMeja" ? "Tenis Meja" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Jam Bermain
            </label>
            <Select
              value={filters.timeSlot}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, timeSlot: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jam</SelectItem>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Rentang Tanggal
            </label>
            <DatePickerWithRange
              date={filters.dateRange}
              onDateChange={(dateRange) =>
                setFilters((prev) => ({ ...prev, dateRange }))
              }
            />
          </div>
          <div className="flex items-center gap-2 flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filter
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">
            Total Transaksi
          </div>
          <div className="text-2xl font-bold text-primary">
            {filteredData.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-600">
            Total Pemasukan
          </div>
          <div className="text-lg font-bold text-green-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(totalIncome)}
          </div>
        </div>

        {Object.entries(statsByType)
          .slice(0, 3)
          .map(([type, stats]) => (
            <div
              key={type}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="text-sm font-medium text-gray-600">
                {type === "TenisMeja" ? "Tenis Meja" : type}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(stats.revenue)}
              </div>
              <div className="text-xs text-gray-500">
                {stats.count} transaksi
              </div>
            </div>
          ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">Cari</span>
        <Input
          placeholder="Cari pelanggan, lapangan, atau metode pembayaran..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-md"
        />
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
                  Tidak ada data sesuai filter
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

export default IncomeTable;
