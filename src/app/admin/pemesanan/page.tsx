import React from "react";
import { getBookings } from "@/lib/db";
import OrderTable from "@/components/Admin/Pemesanan/order-table";
import { Booking, BookingStatus, Court, User } from "@/app/generated/prisma";

interface ManageOrderProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export type BookingWithRelations = Booking & {
  user: User;
  court: Court;
};

const ManageOrder = async ({ searchParams }: ManageOrderProps) => {
  const search = await searchParams;

  const urlSearchParams = new URLSearchParams(
    Object.entries(search).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Array.isArray(value) ? value[0] : value;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const filters: {
    userId?: string;
    courtId?: string;
    date?: Date;
    status?: BookingStatus;
    search?: string;
  } = {};

  if (urlSearchParams.get("user")) {
    filters.userId = urlSearchParams.get("user") as string;
  }
  if (urlSearchParams.get("courtId")) {
    filters.courtId = urlSearchParams.get("courtId") as string;
  }
  if (urlSearchParams.get("date")) {
    filters.date = new Date(urlSearchParams.get("date") as string);
  }
  if (urlSearchParams.get("status")) {
    filters.status = urlSearchParams.get("status") as BookingStatus;
  }
  if (urlSearchParams.get("search")) {
    filters.search = urlSearchParams.get("search") as string;
  }

  const filtersForDb = {
    ...filters,
    date: filters.date?.toISOString(),
  };

  const bookings = await getBookings(filtersForDb);

  return (
    <section className="container mx-auto">
      <h1 className="text-2xl sm:text-2xl 2xl:text-4xl font-semibold leading-tight text-primary">
        Kelola Pemesanan
      </h1>
      <p className="text-gray-600 mt-2">
        Manage dan monitor kelola pemesanan dengan mudah
      </p>
      <div className="mt-2 w-full">
        <OrderTable data={bookings as unknown as BookingWithRelations[]} />
      </div>
    </section>
  );
};

export default ManageOrder;
