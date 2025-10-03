import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recurringBookingId, amount, customerDetails } = await req.json();

    // Get recurring booking details
    const recurringBooking = await prisma.recurringBooking.findUnique({
      where: { id: recurringBookingId },
      include: {
        court: true,
        user: true,
        Transaction: true,
      },
    });

    if (!recurringBooking) {
      return NextResponse.json(
        { error: "Recurring booking not found" },
        { status: 404 }
      );
    }

    const existingTransaction = recurringBooking.Transaction?.[0];
    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Initialize Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false, // Set to true for production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const orderId = `recurring-${recurringBooking.id}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: customerDetails,
      item_details: [
        {
          id: recurringBooking.court.id,
          price: amount,
          quantity: 1,
          name: `Pemesanan Berulang - ${recurringBooking.court.name}`,
        },
      ],
      callbacks: {
        finish: `${baseUrl}/payment/success?booking_id=${recurringBooking.id}`,
        error: `${baseUrl}/payment/failed?booking_id=${recurringBooking.id}`,
        pending: `${baseUrl}/payment/pending?booking_id=${recurringBooking.id}`,
      },
    };

    const midtransResponse = await snap.createTransaction(parameter);

    // Update transaction record with Midtrans details
    await prisma.transaction.update({
      where: { id: existingTransaction.id },
      data: {
        midtransToken: midtransResponse.token,
        midtransOrderId: orderId,
        paymentUrl: midtransResponse.redirect_url,
      },
    });

    return NextResponse.json({
      success: true,
      token: midtransResponse.token,
      redirect_url: midtransResponse.redirect_url,
    });
  } catch (error) {
    console.error("Error processing recurring payment:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
