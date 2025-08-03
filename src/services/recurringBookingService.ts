import { prisma } from "@/lib/prisma";
import {
  RecurringBookingFormData,
  RecurringBookingPreview,
} from "@/types/RecurringBooking";

/**
 * Generate array of dates for recurring booking based on day of week
 */
export function getRecurringDates(
  dayOfWeek: number, // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  // Convert our dayOfWeek (1-7, Mon-Sun) to JavaScript getDay() (0-6, Sun-Sat)
  const targetDay = dayOfWeek === 7 ? 0 : dayOfWeek;

  // Adjust to the first occurrence of the target day
  while (current.getDay() !== targetDay) {
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
 * Calculate discount for recurring booking based on number of sessions
 */
export function calculateRecurringDiscount(totalSessions: number): {
  discountPercentage: number;
} {
  let discountPercentage = 0;
  
  if (totalSessions >= 16) {
    discountPercentage = 15; // 15% untuk 16+ sesi
  } else if (totalSessions >= 8) {
    discountPercentage = 10; // 10% untuk 8-15 sesi
  } else if (totalSessions >= 4) {
    discountPercentage = 5; // 5% untuk 4-7 sesi
  }
  
  return { discountPercentage };
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
  const originalTotalPrice = pricePerSession * totalSessions;
  
  // Calculate discount
  const discount = calculateRecurringDiscount(totalSessions);
  const discountAmount = Math.floor((originalTotalPrice * discount.discountPercentage) / 100);
  const finalTotalPrice = originalTotalPrice - discountAmount;

  return {
    dates,
    totalSessions,
    pricePerSession,
    totalPrice: finalTotalPrice,
    originalTotalPrice,
    discountPercentage: discount.discountPercentage,
    discountAmount,
  };
}

/**
 * Create recurring booking with individual bookings for each occurrence
 */
export async function createRecurringBooking(
  userId: string,
  data: RecurringBookingFormData,
  options?: {
    status?: "Pending" | "Paid" | "Canceled";
    paymentMethod?: "BankTransfer" | "Cash" | "QRIS";
  }
) {
  const defaultStatus = options?.status || "Pending";
  const defaultPaymentMethod = options?.paymentMethod || "BankTransfer";
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
      // Check if there's already a booking on this date and time
      const currentDate = new Date(date);
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBooking = await tx.booking.findFirst({
        where: {
          courtId: data.courtId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
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
          `Lapangan sudah dipesan untuk tanggal ${currentDate.toLocaleDateString(
            "id-ID"
          )} jam ${startTime}-${endTime}`
        );
      }

      // Check if schedule slot is available
      const scheduleSlot = await tx.schedule.findFirst({
        where: {
          courtId: data.courtId,
          timeSlot: data.timeSlot,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          available: true,
        },
      });

      if (!scheduleSlot) {
        throw new Error(
          `Jadwal tidak tersedia untuk tanggal ${currentDate.toLocaleDateString(
            "id-ID"
          )} jam ${data.timeSlot}`
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
    const originalTotalPrice = pricePerSession * recurringDates.length;
    
    // Calculate discount for recurring booking
    const discount = calculateRecurringDiscount(recurringDates.length);
    const discountAmount = Math.floor((originalTotalPrice * discount.discountPercentage) / 100);
    const finalTotalPrice = originalTotalPrice - discountAmount;

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
        paymentMethod: defaultPaymentMethod,
        totalAmount: finalTotalPrice,
        status: defaultStatus,
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
            paymentMethod: defaultPaymentMethod,
            amount: pricePerSession,
            status: defaultStatus,
            recurringBookingId: recurringBooking.id,
          },
        });

        // Update schedule to mark as booked
        const currentDate = new Date(date);
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const updatedSchedules = await tx.schedule.updateMany({
          where: {
            courtId: data.courtId,
            timeSlot: data.timeSlot,
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            available: true, // Only update if still available
          },
          data: {
            available: false,
            bookingId: booking.id,
          },
        });

        console.log(
          `Updated ${
            updatedSchedules.count
          } schedules for date ${currentDate.toISOString()}, courtId: ${
            data.courtId
          }, timeSlot: ${data.timeSlot}`
        );

        return booking;
      })
    );

    // Create transaction record
    const transactionRecord = await tx.transaction.create({
      data: {
        recurringBookingId: recurringBooking.id,
        paymentMethod: defaultPaymentMethod,
        transactionId: `recurring-${recurringBooking.id}`,
        amount: finalTotalPrice,
        status: defaultStatus,
      },
    });

    return {
      recurringBooking,
      bookings,
      transaction: transactionRecord,
      totalPrice: finalTotalPrice,
      totalSessions: recurringDates.length,
    };
  });

  return transaction;
}
