"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  RotateCcw,
  Eye,
  MapPin,
  Grid3X3,
  Plus,
} from "lucide-react";
import { Court } from "@/app/generated/prisma";
import { getColumns } from "../columns";
import Link from "next/link";
import { PiCourtBasketballFill } from "react-icons/pi";

interface CourtTableProps {
  data: Court[];
  role: string;
}

interface FilterState {
  type: string;
  surfaceType: string;
  capacityRange: string;
}

const CourtTable = ({ data, role }: CourtTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    surfaceType: "all",
    capacityRange: "all",
  });

  const columns = getColumns(role);

  // Calculate stats
  const calculateStats = {
    total: data.length,
    active: data.filter((court) => !court.isDeleted).length,
    futsal: data.filter((court) => court.type === "Futsal").length,
    badminton: data.filter((court) => court.type === "Badminton").length,
    tenisMeja: data.filter((court) => court.type === "TenisMeja").length,
    avgCapacity:
      data.length > 0
        ? Math.round(
            data.reduce((sum, court) => sum + court.capacity, 0) / data.length
          )
        : 0,
  };

  // Get unique values for filters
  const uniqueTypes = useMemo(() => {
    return [...new Set(data.map((court) => court.type).filter(Boolean))];
  }, [data]);

  const uniqueSurfaceTypes = useMemo(() => {
    return [...new Set(data.map((court) => court.surfaceType).filter(Boolean))];
  }, [data]);

  // Advanced filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // General search
    if (filtering) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(filtering.toLowerCase()) ||
          court.type.toLowerCase().includes(filtering.toLowerCase()) ||
          court.description?.toLowerCase().includes(filtering.toLowerCase()) ||
          court.surfaceType?.toLowerCase().includes(filtering.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((court) => court.type === filters.type);
    }

    // Surface type filter
    if (filters.surfaceType !== "all") {
      filtered = filtered.filter(
        (court) => court.surfaceType === filters.surfaceType
      );
    }

    // Capacity range filter
    if (filters.capacityRange !== "all") {
      const capacityRanges = {
        small: { min: 1, max: 10 },
        medium: { min: 11, max: 20 },
        large: { min: 21, max: Infinity },
      };

      const range =
        capacityRanges[filters.capacityRange as keyof typeof capacityRanges];
      if (range) {
        filtered = filtered.filter(
          (court) => court.capacity >= range.min && court.capacity <= range.max
        );
      }
    }

    return filtered;
  }, [data, filtering, filters]);

  // Statistics
  const stats = useMemo(() => {
    const typeStats = filteredData.reduce((acc, court) => {
      acc[court.type] = (acc[court.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgCapacity =
      filteredData.length > 0
        ? Math.round(
            filteredData.reduce((sum, court) => sum + court.capacity, 0) /
              filteredData.length
          )
        : 0;

    const activeCourts = filteredData.filter(
      (court) => !court.isDeleted
    ).length;

    return {
      total: filteredData.length,
      typeStats,
      avgCapacity,
      activeCourts,
    };
  }, [filteredData]);

  const resetFilters = () => {
    setFilters({
      type: "all",
      surfaceType: "all",
      capacityRange: "all",
    });
    setFiltering("");
  };

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Lapangan
                </p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCourts}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Jenis Terbanyak
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {Object.entries(stats.typeStats).sort(
                    ([, a], [, b]) => b - a
                  )[0]?.[0] || "-"}
                </p>
              </div>
              <PiCourtBasketballFill className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Jenis Lapangan
                </p>
                <div className="flex gap-1 mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    F: {calculateStats.futsal}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    B: {calculateStats.badminton}
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    T: {calculateStats.tenisMeja}
                  </span>
                </div>
              </div>
              <Grid3X3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Lapangan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Jenis Lapangan
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Surface Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Tipe Permukaan
              </label>
              <Select
                value={filters.surfaceType}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, surfaceType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih permukaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Permukaan</SelectItem>
                  {uniqueSurfaceTypes.map((surfaceType) => (
                    <SelectItem key={surfaceType} value={surfaceType as string}>
                      {surfaceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Menampilkan {filteredData.length} dari {data.length} lapangan
              </span>
            </div>

            {/* Type Distribution */}
            <div className="flex items-center gap-2">
              {Object.entries(stats.typeStats).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari nama, jenis, atau deskripsi lapangan..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="max-w-2xl"
          />
        </div>

        <Link href="/admin/lapangan/tambah">
          <Button className="bg-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Lapangan
          </Button>
        </Link>
      </div>

      {/* Enhanced Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-primary text-white"
                    >
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
                      row.original.isDeleted ? "bg-red-50 opacity-60" : ""
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
                      <MapPin className="h-8 w-8 text-gray-400" />
                      <span>Tidak ada lapangan ditemukan</span>
                      {(filtering ||
                        Object.values(filters).some((f) => f !== "all")) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Enhanced Pagination */}
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

export default CourtTable;
