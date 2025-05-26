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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Download,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Transaction } from "@/app/generated/prisma";

interface TransactionWithBooking extends Transaction {
  booking: {
    user: {
      name: string;
    };
  };
}

interface Props {
  data: TransactionWithBooking[];
  columns: ColumnDef<TransactionWithBooking>[];
}

const IncomeTable = ({ data, columns }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Filter data berdasarkan periode waktu
  const filteredData = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "this-month":
        return data.filter(
          (item) =>
            new Date(item.createdAt) >= startOfMonth(now) &&
            new Date(item.createdAt) <= endOfMonth(now)
        );
      case "last-month":
        const lastMonth = subMonths(now, 1);
        return data.filter(
          (item) =>
            new Date(item.createdAt) >= startOfMonth(lastMonth) &&
            new Date(item.createdAt) <= endOfMonth(lastMonth)
        );
      case "this-year":
        return data.filter(
          (item) =>
            new Date(item.createdAt) >= startOfYear(now) &&
            new Date(item.createdAt) <= endOfYear(now)
        );
      default:
        return data; // "all" or no filter
    }
  }, [selectedPeriod, data]);

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

  // Hitung total pemasukan dari data yang difilter
  const calculateTotal = (data: TransactionWithBooking[]) => {
    return data.reduce((sum, item) => sum + Number(item.amount), 0);
  };
  const totalIncome = calculateTotal(filteredData);

  // Fungsi untuk ekspor data ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Pemasukan", 14, 10);
    autoTable(doc, {
      head: [["No", "Pelanggan", "Tanggal", "Jumlah", "Metode Pembayaran"]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.booking.user.name,
        format(new Date(item.createdAt), "d MMM yyyy", { locale: id }),
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(item.amount)),
        item.paymentMethod,
      ]),
      startY: 20,
      headStyles: {
        fillColor: [18, 105, 120],
        textColor: [255, 255, 255],
      },
    });
    doc.save("laporan-pemasukan.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Semua
              </SelectItem>
              <SelectItem value="this-month" className="cursor-pointer">
                Bulan Ini
              </SelectItem>
              <SelectItem value="last-month" className="cursor-pointer">
                Bulan Lalu
              </SelectItem>
              <SelectItem value="this-year" className="cursor-pointer">
                Tahun Ini
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={exportToPDF}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
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
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Total Pemasukan:</span>
          <span className="font-semibold text-primary">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalIncome)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
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

        <div className="flex items-center gap-2">
          <span className="text-gray-500">Halaman:</span>
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
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Tampilkan:</span>
          <Select
            onValueChange={(value) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(value),
              }))
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={pagination.pageSize} />
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
  );
};

export default IncomeTable;
