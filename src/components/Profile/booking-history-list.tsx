"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BsFillCartXFill } from "react-icons/bs";
import BookingHistory from "@/components/Profile/booking-history";
import Pagination from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingData {
  id: string;
  userId: string;
  courtId: string;
  court: {
    name: string;
    image: string;
  };
  courtType: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  paymentMethod: string;
  status: string;
  duration: number;
  isConfirmed: boolean;
  rescheduleFrom: string | null;
  rescheduleCount: number;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface BookingHistoryResponse {
  bookings: BookingData[];
  pagination: PaginationData;
}

const BookingHistoryList = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/booking-history?page=${page}&limit=3`);

      if (!response.ok) {
        throw new Error("Failed to fetch booking history");
      }

      const data: BookingHistoryResponse = await response.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePageChange = (page: number) => {
    fetchBookings(page);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="w-full md:w-1/3 h-48" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-36">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-36">
        <BsFillCartXFill className="h-20 w-20 text-gray-400 mb-4" />
        <p className="text-gray-500">Tidak ada pembayaran yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header dengan informasi total */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Riwayat Pembayaran</h2>
        <p className="text-sm text-gray-500">
          Menampilkan {bookings.length} dari {pagination.totalCount} pembayaran
        </p>
      </div>

      {/* List of bookings */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingHistory key={booking.id} booking={booking} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
      />
    </div>
  );
};

export default BookingHistoryList;
