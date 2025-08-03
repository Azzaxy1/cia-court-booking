"use client";
import React, { useMemo, useState } from "react";
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Plus,
  Filter,
  RotateCcw,
  Clock,
  MapPin,
  Search,
  CalendarDays,
} from "lucide-react";

import { Court, Schedule } from "@/app/generated/prisma";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getColumns } from "../columns";
import {
  isToday,
  isTomorrow,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface ScheduleWithCourt extends Schedule {
  court: Court;
}

interface Props {
  data: ScheduleWithCourt[];
  scheduleStats: {
    total: number;
    occupied: number;
    available: number;
    todaySchedules: number;
    weekSchedules: number;
  };
}

interface FilterState {
  court: string;
  status: string;
  timeRange: string;
  dayType: string;
  dateRange: string;
}

const ScheduleTable = ({ data, scheduleStats }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<FilterState>({
    court: "all",
    status: "all",
    timeRange: "all",
    dayType: "all",
    dateRange: "all",
  });

  const { data: session } = useSession();
  const columns = getColumns(session?.user?.role || "ADMIN");

  // Get unique values for filters
  const uniqueCourts = useMemo(() => {
    const courtsMap = new Map<string, Court>();
    data.forEach((schedule) => {
      courtsMap.set(schedule.court.id, schedule.court);
    });
    return Array.from(courtsMap.values());
  }, [data]);

  const uniqueDayTypes = useMemo(() => {
    return [...new Set(data.map((schedule) => schedule.dayType))];
  }, [data]);

  // Advanced filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // General search
    if (filtering) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.court.name.toLowerCase().includes(filtering.toLowerCase()) ||
          schedule.timeSlot.toLowerCase().includes(filtering.toLowerCase()) ||
          schedule.dayType.toLowerCase().includes(filtering.toLowerCase())
      );
    }

    // Court filter
    if (filters.court !== "all") {
      filtered = filtered.filter(
        (schedule) => schedule.court.id === filters.court
      );
    }

    // Status filter
    if (filters.status !== "all") {
      const isAvailable = filters.status === "available";
      filtered = filtered.filter(
        (schedule) => schedule.available === isAvailable
      );
    }

    // Time range filter
    if (filters.timeRange !== "all") {
      const timeRanges = {
        morning: (time: string) => {
          const hour = parseInt(time.split(":")[0]);
          return hour >= 6 && hour < 12;
        },
        afternoon: (time: string) => {
          const hour = parseInt(time.split(":")[0]);
          return hour >= 12 && hour < 18;
        },
        evening: (time: string) => {
          const hour = parseInt(time.split(":")[0]);
          return hour >= 18 && hour <= 23;
        },
      };

      const rangeChecker =
        timeRanges[filters.timeRange as keyof typeof timeRanges];
      if (rangeChecker) {
        filtered = filtered.filter((schedule) =>
          rangeChecker(schedule.timeSlot)
        );
      }
    }

    // Day type filter
    if (filters.dayType !== "all") {
      filtered = filtered.filter(
        (schedule) => schedule.dayType === filters.dayType
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      switch (filters.dateRange) {
        case "today":
          filtered = filtered.filter((schedule) => isToday(schedule.date));
          break;
        case "tomorrow":
          filtered = filtered.filter((schedule) => isTomorrow(schedule.date));
          break;
        case "this-week":
          filtered = filtered.filter((schedule) =>
            isWithinInterval(schedule.date, {
              start: startOfWeek(now),
              end: endOfWeek(now),
            })
          );
          break;
      }
    }

    return filtered;
  }, [data, filtering, filters]);

  // Statistics
  const stats = useMemo(() => {
    const available = filteredData.filter((s) => s.available).length;
    const occupied = filteredData.filter((s) => !s.available).length;
    const totalRevenue = filteredData.reduce((sum, s) => sum + s.price, 0);
    const avgPrice =
      filteredData.length > 0 ? totalRevenue / filteredData.length : 0;

    return {
      total: filteredData.length,
      available,
      occupied,
      totalRevenue,
      avgPrice,
    };
  }, [filteredData]);

  const resetFilters = () => {
    setFilters({
      court: "all",
      status: "all",
      timeRange: "all",
      dayType: "all",
      dateRange: "all",
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
                  Total Jadwal
                </p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tersedia</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.available}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terisi</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.occupied}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                <p className="text-2xl font-bold text-blue-600">
                  {scheduleStats.todaySchedules}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Jadwal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Court Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Lapangan
              </label>
              <Select
                value={filters.court}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, court: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lapangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lapangan</SelectItem>
                  {uniqueCourts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="occupied">Terisi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Waktu
              </label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, timeRange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="morning">Pagi (07:00-13:00)</SelectItem>
                  <SelectItem value="afternoon">Siang (14:00-18:00)</SelectItem>
                  <SelectItem value="evening">Malam (19:00-23:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Day Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Tipe Hari
              </label>
              <Select
                value={filters.dayType}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, dayType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hari</SelectItem>
                  {uniqueDayTypes.map((dayType) => (
                    <SelectItem key={dayType} value={dayType}>
                      {dayType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Periode
              </label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, dateRange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tanggal</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="tomorrow">Besok</SelectItem>
                  <SelectItem value="this-week">Minggu Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filter
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Menampilkan {filteredData.length} dari {data.length} jadwal
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari lapangan, waktu, atau tipe hari..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="max-w-2xl w-full"
          />
        </div>

        {session?.user?.role === "CASHIER" && (
          <Link href="/admin/jadwal/tambah">
            <Button className="bg-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Jadwal
            </Button>
          </Link>
        )}
      </div>

      {/* Table */}
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
                      isToday(row.original.date)
                        ? "bg-blue-50 border-l-4 border-l-blue-400"
                        : ""
                    } ${!row.original.available ? "bg-red-50" : ""}`}
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
                      <CalendarDays className="h-8 w-8 text-gray-400" />
                      <span>Tidak ada jadwal ditemukan</span>
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

export default ScheduleTable;
