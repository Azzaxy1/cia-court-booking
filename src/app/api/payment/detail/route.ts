import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DAYS_OF_WEEK } from "@/types/RecurringBooking";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");
  if (!orderId) {
    return NextResponse.json(
      {
        error: "Order ID is required",
      },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.findFirst({
    where: { midtransOrderId: orderId },
    include: {
      booking: {
        include: {
          court: true,
        },
      },
      recurringBooking: {
        include: {
          court: true,
          bookings: true,
        },
      },
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        error: "Transaction not found",
      },
      { status: 404 }
    );
  }

  // Check if it's a regular booking or recurring booking
  if (transaction.booking) {
    // Regular booking
    return NextResponse.json({
      type: "booking",
      orderId: transaction.midtransOrderId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      date: transaction.createdAt.toISOString(),
      courtName: transaction.booking.court.name,
      bookingDate: transaction.booking.date,
      startTime: transaction.booking.startTime,
      endTime: transaction.booking.endTime,
      courtType: transaction.booking.courtType,
    });
  } else if (transaction.recurringBooking) {
    // Recurring booking
    const recurringBooking = transaction.recurringBooking;
    const dayName = DAYS_OF_WEEK[recurringBooking.dayOfWeek - 1];
    
    return NextResponse.json({
      type: "recurringBooking",
      orderId: transaction.midtransOrderId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      date: transaction.createdAt.toISOString(),
      courtName: recurringBooking.court.name,
      courtType: recurringBooking.courtType,
      startTime: recurringBooking.startTime,
      endTime: recurringBooking.endTime,
      dayOfWeek: recurringBooking.dayOfWeek,
      dayName: dayName,
      startDate: recurringBooking.startDate,
      endDate: recurringBooking.endDate,
      totalSessions: recurringBooking.bookings.length,
      recurringSchedule: `Setiap ${dayName} jam ${recurringBooking.startTime}-${recurringBooking.endTime}`,
    });
  }

  return NextResponse.json({
    orderId: transaction.midtransOrderId,
    amount: transaction.amount,
    paymentMethod: transaction.paymentMethod,
    status: transaction.status,
    date: transaction.createdAt.toISOString(),
    courtName: "Unknown",
  });
}
