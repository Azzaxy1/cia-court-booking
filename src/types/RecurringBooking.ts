import {
  RecurringBooking as PrismaRecurringBooking,
  Booking,
  Court,
  User,
  Transaction,
} from "@/app/generated/prisma";

export interface RecurringBooking extends PrismaRecurringBooking {
  user: User;
  court: Court;
  bookings: Booking[];
  Transaction: Transaction[];
}

export interface RecurringBookingFormData {
  courtId: string;
  timeSlot: string;
  dayOfWeek: number;
  startDate: Date;
  endDate: Date;
}

export interface RecurringBookingPreview {
  dates: Date[];
  totalSessions: number;
  pricePerSession: number;
  totalPrice: number;
}

export const DAYS_OF_WEEK = [
  "Senin",
  "Selasa", 
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
