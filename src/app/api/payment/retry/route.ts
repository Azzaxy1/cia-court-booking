import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";
import { nanoid } from "nanoid";

const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID diperlukan" },
        { status: 400 }
      );
    }

    // Get booking dengan user validation
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: "Pending", // Hanya allow retry untuk status pending
      },
      include: {
        user: true,
        court: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking tidak ditemukan atau tidak dapat diproses ulang" },
        { status: 404 }
      );
    }

    // Generate new transaction ID untuk retry
    const newTransactionId = `ORDER-${nanoid(10)}`;

    // Create new transaction record
    const transaction = await prisma.transaction.create({
      data: {
        bookingId: booking.id,
        paymentMethod: "midtrans",
        transactionId: newTransactionId,
        amount: booking.amount,
        status: "pending",
      },
    });

    // Create Midtrans Snap instance
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey,
    });

    // Prepare Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: newTransactionId,
        gross_amount: booking.amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone || "",
      },
      item_details: [
        {
          id: booking.courtId,
          price: booking.amount,
          quantity: 1,
          name: `Booking ${booking.court.name} - ${booking.startTime}`,
          brand: "CIA Court",
          category: booking.courtType,
          merchant_name: "CIA Court Serang",
        },
      ],
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/payment/success?booking_id=${booking.id}`,
        error: `${process.env.NEXTAUTH_URL}/payment/failed?booking_id=${booking.id}`,
        pending: `${process.env.NEXTAUTH_URL}/payment/pending?booking_id=${booking.id}`,
      },
    };

    // Create transaction token
    const midtransTransaction = await snap.createTransaction(parameter);

    // Update transaction with Midtrans data
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        midtransToken: midtransTransaction.token,
        midtransOrderId: newTransactionId,
        paymentUrl: midtransTransaction.redirect_url,
      },
    });

    return NextResponse.json({
      success: true,
      transactionToken: midtransTransaction.token,
      orderId: newTransactionId,
      message: "Berhasil membuat ulang pembayaran",
    });
  } catch (error) {
    console.error("Error in retry payment:", error);
    return NextResponse.json(
      { error: "Gagal memproses pembayaran ulang" },
      { status: 500 }
    );
  }
}
