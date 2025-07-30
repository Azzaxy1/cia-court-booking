import { prisma } from "@/lib/prisma";
import {
  RecurringBookingFormData,
  RecurringBookingPreview,
} from "@/types/RecurringBooking";

/**
 * Generate array of dates for recurring booking based on day of week
 */
export function getRecurringDates(
  dayOfWeek: number, // 1 = Monday, 7 = Sunday
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  // Adjust to the first occurrence of the target day
  while (current.getDay() !== (dayOfWeek === 7 ? 0 : dayOfWeek)) {
    current.setDate(current.getDate() + 1);
  }

  // Generate all dates until end date
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7); // Add 7 days for next week
  }

  return dates;
}

/**
 * Get preview of recurring booking (dates and total cost)
 */
export async function getRecurringBookingPreview(
  courtId: string,
  dayOfWeek: number,
  startDate: Date,
  endDate: Date,
  timeSlot: string
): Promise<RecurringBookingPreview> {
  const dates = getRecurringDates(dayOfWeek, startDate, endDate);

  // Get court price by finding a schedule that matches the time slot
  const schedule = await prisma.schedule.findFirst({
    where: {
      courtId,
      timeSlot,
    },
  });

  if (!schedule) {
    throw new Error("Jadwal tidak ditemukan untuk waktu yang dipilih");
  }

  const pricePerSession = schedule.price;
  const totalSessions = dates.length;
  const totalPrice = pricePerSession * totalSessions;

  return {
    dates,
    totalSessions,
    pricePerSession,
    totalPrice,
  };
}

/**
 * Create recurring booking with individual bookings for each occurrence
 */
export async function createRecurringBooking(
  userId: string,
  data: RecurringBookingFormData
) {
  // Parse timeSlot - handle both single time (HH:MM) and range (HH:MM-HH:MM) formats
  let startTime: string;
  let endTime: string;

  if (data.timeSlot.includes("-")) {
    // Range format: "10:00-11:00"
    const timeSlotParts = data.timeSlot.split("-");
    if (timeSlotParts.length !== 2) {
      throw new Error(
        `Invalid timeSlot format: ${data.timeSlot}. Expected format: HH:MM or HH:MM-HH:MM`
      );
    }
    startTime = timeSlotParts[0]?.trim();
    endTime = timeSlotParts[1]?.trim();
  } else {
    // Single time format: "10:00" - calculate endTime by adding 1 hour
    startTime = data.timeSlot.trim();
    const [hours, minutes] = startTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(
        `Invalid timeSlot format: ${data.timeSlot}. Expected format: HH:MM or HH:MM-HH:MM`
      );
    }
    const endHour = (hours + 1) % 24; // Handle 23:00 -> 00:00 case
    endTime = `${endHour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // Validate time format
  if (!startTime || !endTime) {
    throw new Error(
      `Invalid timeSlot format: ${data.timeSlot}. Unable to determine start and end times`
    );
  }

  // Log untuk debugging
  console.log("timeSlot:", data.timeSlot);
  console.log("parsed startTime:", startTime);
  console.log("parsed endTime:", endTime);

  const transaction = await prisma.$transaction(async (tx) => {
    // Validate court exists
    const court = await tx.court.findUnique({
      where: { id: data.courtId },
    });

    if (!court) {
      throw new Error("Lapangan tidak ditemukan");
    }

    // Generate recurring dates
    const recurringDates = getRecurringDates(
      data.dayOfWeek,
      data.startDate,
      data.endDate
    );

    if (recurringDates.length === 0) {
      throw new Error("Tidak ada tanggal yang valid untuk pemesanan berulang");
    }

    // Check availability for all dates
    for (const date of recurringDates) {
      const existingBooking = await tx.booking.findFirst({
        where: {
          courtId: data.courtId,
          date: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
          startTime,
          endTime,
          status: {
            in: ["Paid", "Pending"],
          },
        },
      });

      if (existingBooking) {
        throw new Error(
          `Lapangan sudah dipesan untuk tanggal ${date.toLocaleDateString(
            "id-ID"
          )}`
        );
      }
    }

    // Get price from schedule
    const schedule = await tx.schedule.findFirst({
      where: {
        courtId: data.courtId,
        timeSlot: data.timeSlot,
      },
    });

    if (!schedule) {
      throw new Error("Jadwal tidak ditemukan untuk waktu yang dipilih");
    }

    const pricePerSession = schedule.price;
    const totalPrice = pricePerSession * recurringDates.length;

    // Create recurring booking
    const recurringBooking = await tx.recurringBooking.create({
      data: {
        userId,
        courtId: data.courtId,
        startTime,
        endTime,
        courtType: court.type,
        duration: 1, // Default 1 hour, could be calculated from timeSlot
        dayOfWeek: data.dayOfWeek,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentMethod: "BankTransfer",
        totalAmount: totalPrice,
        status: "Pending",
      },
    });

    // Create individual bookings for each date
    const bookings = await Promise.all(
      recurringDates.map(async (date) => {
        const booking = await tx.booking.create({
          data: {
            userId,
            courtId: data.courtId,
            startTime,
            endTime,
            courtType: court.type,
            duration: 1, // Default 1 hour
            date,
            paymentMethod: "BankTransfer",
            amount: pricePerSession,
            status: "Pending",
            recurringBookingId: recurringBooking.id,
          },
        });

        // Update schedule to mark as booked
        await tx.schedule.updateMany({
          where: {
            courtId: data.courtId,
            timeSlot: data.timeSlot,
            date: date,
          },
          data: {
            available: false,
            bookingId: booking.id,
          },
        });

        return booking;
      })
    );

    // Create transaction record
    const transactionRecord = await tx.transaction.create({
      data: {
        recurringBookingId: recurringBooking.id,
        paymentMethod: "BankTransfer",
        transactionId: `recurring-${recurringBooking.id}`,
        amount: totalPrice,
        status: "Pending",
      },
    });

    return {
      recurringBooking,
      bookings,
      transaction: transactionRecord,
      totalPrice,
      totalSessions: recurringDates.length,
    };
  });

  return transaction;
}
