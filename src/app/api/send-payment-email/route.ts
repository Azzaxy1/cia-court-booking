// app/api/send-payment-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    const bookingId = orderId.replace("order-", "");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        court: true,
      },
    });

    if (!booking || !booking.user.email) {
      return NextResponse.json({
        success: false,
        error: "Booking or email not found",
      });
    }

    // Prepare email data
    const emailData = {
      customerEmail: booking.user.email,
      customerName: booking.user.name,
      orderId: orderId,
      courtName: booking.court.name,
      amount: booking.amount,
      date: booking.date.toISOString(),
      timeSlot: `${booking.startTime} - ${booking.endTime}`,
      paymentMethod: booking.paymentMethod,
    };

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
