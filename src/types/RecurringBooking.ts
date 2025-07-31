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

export interface RecurringBookingWithRelations extends PrismaRecurringBooking {
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  court: {
    id: string;
    name: string;
    type: string;
  };
  bookings: {
    id: string;
    date: Date;
    status: string;
  }[];
  Transaction: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: Date;
  }[];
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
