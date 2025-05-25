import { Booking as PrismaBooking, Court } from "@/app/generated/prisma";

export type BookingStatus = "Pending" | "Paid" | "Canceled" | "Refunded";

export interface Booking extends PrismaBooking {
  court: Court;
}
