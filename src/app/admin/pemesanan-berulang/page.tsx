"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { recurringBookingsColumns } from "@/components/Admin/RecurringBookings/columns";
import RecurringBookingsTable from "@/components/Admin/RecurringBookings/RecurringBookingsTable";
import { getRecurringBookings } from "@/services/mainService";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const RecurringBookingsPage = () => {
  const { data: session } = useSession();

  const {
    data: recurringBookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-recurring-bookings"],
    queryFn: getRecurringBookings,
    enabled:
      !!session?.user?.role && ["CASHIER", "OWNER"].includes(session.user.role),
  });

  // Ensure data is always an array
  const safeRecurringBookings = Array.isArray(recurringBookings)
    ? recurringBookings
    : [];

  // Check if user has proper access
  if (
    !session?.user?.role ||
    !["CASHIER", "OWNER"].includes(session.user.role)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Akses Ditolak
            </h1>
            <p className="text-gray-600">
              Anda tidak memiliki akses untuk melihat halaman ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-600">
              Gagal memuat data pemesanan berulang. Silakan coba lagi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-primary">
              Monitor Pemesanan Berulang
            </h1>
          </div>
          <p className="text-gray-600">
            Kelola dan pantau semua pemesanan berulang dari pelanggan
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <h2 className="flex font-medium items-center gap-2 text-gray-700">
              <CalendarClock className="h-5 w-5" />
              Data Pemesanan Berulang
            </h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {/* Loading summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>

                {/* Loading table */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ) : (
              <RecurringBookingsTable
                data={safeRecurringBookings}
                columns={recurringBookingsColumns}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecurringBookingsPage;
