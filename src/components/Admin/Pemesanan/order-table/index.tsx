"use client";
import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
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
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  CircleDollarSign,
  Search,
} from "lucide-react";

import { BookingStatus, Court } from "@/app/generated/prisma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { PiCourtBasketball } from "react-icons/pi";
import { BookingWithRelations } from "@/app/admin/pemesanan/page";
import { useSession } from "next-auth/react";
import { getColumns } from "../columns";

interface Props {
  data: BookingWithRelations[];
}

const OrderTable = ({ data }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const columns = getColumns(session?.user?.role || "ADMIN");

  const initialSearch = searchParams.get("search") || "";
  const initialCourt = searchParams.get("court") || "all";
  const initialStatus = searchParams.get("status") || "";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState(initialSearch);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCourt, setSelectedCourt] = useState(initialCourt);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const [searchMode, setSearchMode] = useState<"general" | "email" | "date">(
    "general"
  );
  const [emailSearch, setEmailSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  const debouncedSetFiltering = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        router.push(`/admin/pemesanan?${params.toString()}`);
      }, 300),
    [searchParams, router]
  );

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter berdasarkan search mode
    if (searchMode === "email" && emailSearch) {
      filtered = filtered.filter((booking) =>
        booking.user.email?.toLowerCase().includes(emailSearch.toLowerCase())
      );
    } else if (searchMode === "date" && dateSearch) {
      const searchDate = new Date(dateSearch);
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return (
          bookingDate.getDate() === searchDate.getDate() &&
          bookingDate.getMonth() === searchDate.getMonth() &&
          bookingDate.getFullYear() === searchDate.getFullYear()
        );
      });
    } else if (searchMode === "general" && filtering) {
      filtered = filtered.filter(
        (booking) =>
          booking.user.name.toLowerCase().includes(filtering.toLowerCase()) ||
          booking.court.name.toLowerCase().includes(filtering.toLowerCase()) ||
          booking.paymentMethod
            ?.toLowerCase()
            .includes(filtering.toLowerCase()) ||
          booking.user.email?.toLowerCase().includes(filtering.toLowerCase())
      );
    }

    if (selectedCourt !== "all") {
      filtered = filtered.filter(
        (booking) => booking.court.name === selectedCourt
      );
    }

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === selectedStatus
      );
    }

    return filtered;
  }, [
    data,
    searchMode,
    emailSearch,
    dateSearch,
    filtering,
    selectedCourt,
    selectedStatus,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFiltering(value);
    debouncedSetFiltering(value);
  };

  const handleCourtChange = (value: string) => {
    setSelectedCourt(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("court");
    } else {
      params.set("court", value);
    }
    const newUrl = `?${params.toString()}`;
    router.push(newUrl);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    const newUrl = `?${params.toString()}`;
    router.push(newUrl);
  };

  const clearAllFilters = () => {
    setFiltering("");
    setEmailSearch("");
    setDateSearch("");
    setSelectedCourt("all");
    setSelectedStatus("");
    setSearchMode("general");
    router.push("/admin/pemesanan");
  };

  const uniqueCourts = useMemo(() => {
    const courtsMap = new Map<string, Court>();
    data.forEach((booking) => {
      if (booking.court) {
        courtsMap.set(booking.court.id, booking.court);
      }
    });
    return Array.from(courtsMap.values());
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">Pencarian Kasir</span>
        </div>

        {/* Search Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Mode Pencarian
            </label>
            <Select
              value={searchMode}
              onValueChange={(value: "general" | "email" | "date") =>
                setSearchMode(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Pencarian Umum</SelectItem>
                <SelectItem value="email">Cari by Email</SelectItem>
                <SelectItem value="date">Cari by Tanggal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchMode === "general" && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Pencarian
              </label>
              <Input
                type="text"
                placeholder="Nama, lapangan, atau email..."
                value={filtering}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          )}

          {searchMode === "email" && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Email Pelanggan
              </label>
              <Input
                type="email"
                placeholder="Masukkan email pelanggan..."
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {searchMode === "date" && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Tanggal Booking
              </label>
              <Input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
            >
              Reset Semua Filter
            </Button>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Total ditemukan:</span>
            <Badge variant="outline">{filteredData.length} booking</Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Hari ini:</span>
            <Badge variant="outline">
              {
                filteredData.filter((b) => {
                  const today = new Date();
                  const bookingDate = new Date(b.date);
                  return (
                    bookingDate.getDate() === today.getDate() &&
                    bookingDate.getMonth() === today.getMonth() &&
                    bookingDate.getFullYear() === today.getFullYear()
                  );
                }).length
              }{" "}
              booking
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <PiCourtBasketball className="h-5 w-5 text-gray-500" />
          <Select onValueChange={handleCourtChange} value={selectedCourt}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih lapangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Semua
              </SelectItem>
              {uniqueCourts.map((court) => (
                <SelectItem
                  key={court.id}
                  value={court.name}
                  className="cursor-pointer"
                >
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <CircleDollarSign className="h-5 w-5 text-gray-500" />
          <Select onValueChange={handleStatusChange} value={selectedStatus}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Semua
              </SelectItem>
              {Object.values(BookingStatus)
                .filter((status) => status !== "Refunded")
                .map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="cursor-pointer"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {session?.user?.role === "CASHIER" && (
          <Link href="/admin/pemesanan/tambah">
            <Button className="bg-primary">
              <Plus size={16} />
              Tambah Pemesanan
            </Button>
          </Link>
        )}
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
                  className={`hover:bg-gray-50 ${
                    (searchMode === "email" &&
                      emailSearch &&
                      row.original.user.email
                        ?.toLowerCase()
                        .includes(emailSearch.toLowerCase())) ||
                    (searchMode === "date" &&
                      dateSearch &&
                      new Date(row.original.date).toDateString() ===
                        new Date(dateSearch).toDateString())
                      ? "bg-yellow-50 border-l-4 border-l-yellow-400"
                      : ""
                  }`}
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
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-400" />
                    <span>Tidak ada data ditemukan</span>
                    {(filtering || emailSearch || dateSearch) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                      >
                        Hapus Filter
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination with info */}
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

        <div className="flex items-center justify-start gap-2">
          <span className="text-gray-500">Halaman:</span>
          <Input
            type="number"
            value={pagination.pageIndex + 1}
            className="w-16"
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Number(e.target.value) - 1,
              }))
            }
            min={1}
            max={table.getPageCount()}
          />
          <span className="text-gray-500">
            dari {table.getPageCount()} halaman
          </span>
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

export default OrderTable;
