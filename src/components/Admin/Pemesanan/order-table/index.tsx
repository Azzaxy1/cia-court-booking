"use client";
import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
  Plus,
  CircleDollarSign,
} from "lucide-react";

import { BookingStatus, Court } from "@/app/generated/prisma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { PiCourtBasketball } from "react-icons/pi";
import { BookingWithRelations } from "@/app/admin/pemesanan/page";
import { useSession } from "next-auth/react";

interface Props {
  data: BookingWithRelations[];
  columns: ColumnDef<BookingWithRelations>[];
}

const OrderTable = ({ data, columns }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

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
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });
  return (
    <div className="space-y-4">
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

          {/* Status Filter */}
          <CircleDollarSign className="h-5 w-5 text-gray-500" />
          <Select onValueChange={handleStatusChange} value={selectedStatus}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Semua
              </SelectItem>
              {Object.values(BookingStatus).map((status) => (
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
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Cari..."
              value={filtering}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
            <Button
              variant="outline"
              onClick={() => {
                setFiltering("");
                debouncedSetFiltering("");
              }}
            >
              Hapus Pencarian
            </Button>
          </div>
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
                  Tidak ada data yang tersedia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
