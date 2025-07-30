import {
  Booking as PrismaBooking,
  Court,
  BookingStatus as PrismaBookingStatus,
} from "@/app/generated/prisma";

export type BookingStatus = PrismaBookingStatus;

export interface Booking extends PrismaBooking {
  court: Court;
}
