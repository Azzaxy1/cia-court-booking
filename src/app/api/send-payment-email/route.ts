// app/api/send-payment-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { DAYS_OF_WEEK } from "@/types/RecurringBooking";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    // Try to find transaction first to determine if it's booking or recurring booking
    const transaction = await prisma.transaction.findFirst({
      where: { midtransOrderId: orderId },
      include: {
        booking: {
          include: {
            user: true,
            court: true,
          },
        },
        recurringBooking: {
          include: {
            user: true,
            court: true,
            bookings: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: "Transaction not found",
      });
    }

    let emailData;

    if (transaction.booking) {
      // Regular booking
      const booking = transaction.booking;
      if (!booking.user.email) {
        return NextResponse.json({
          success: false,
          error: "Email not found",
        });
      }

      emailData = {
        customerEmail: booking.user.email,
        customerName: booking.user.name,
        orderId: orderId,
        courtName: booking.court.name,
        amount: booking.amount,
        date: booking.date.toISOString(),
        timeSlot: `${booking.startTime} - ${booking.endTime}`,
        paymentMethod: booking.paymentMethod,
        type: "booking" as const,
      };
    } else if (transaction.recurringBooking) {
      // Recurring booking
      const recurringBooking = transaction.recurringBooking;
      if (!recurringBooking.user.email) {
        return NextResponse.json({
          success: false,
          error: "Email not found",
        });
      }

      const dayName = DAYS_OF_WEEK[recurringBooking.dayOfWeek - 1];

      emailData = {
        customerEmail: recurringBooking.user.email,
        customerName: recurringBooking.user.name,
        orderId: orderId,
        courtName: recurringBooking.court.name,
        amount: recurringBooking.totalAmount,
        startDate: recurringBooking.startDate.toISOString(),
        endDate: recurringBooking.endDate.toISOString(),
        dayName: dayName,
        timeSlot: `${recurringBooking.startTime} - ${recurringBooking.endTime}`,
        paymentMethod: transaction.paymentMethod,
        totalSessions: recurringBooking.bookings.length,
        type: "recurringBooking" as const,
      };
    } else {
      return NextResponse.json({
        success: false,
        error: "No booking or recurring booking found",
      });
    }

    const result = await sendPaymentSuccessEmail(emailData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
