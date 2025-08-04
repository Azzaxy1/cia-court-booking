import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";

const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

export async function POST(req: Request) {
  try {
    const { orderId, amount, customerDetails, bookingId, itemDetails } =
      await req.json();

    if (!orderId || !amount || !customerDetails || !bookingId || !itemDetails) {
      return NextResponse.json(
        { error: "Invalid request, missing required fields" },
        { status: 400 }
      );
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        OR: [{ bookingId }, { midtransOrderId: orderId }],
      },
    });

    if (existingTransaction) {
      return NextResponse.json(
        {
          order_id: existingTransaction.midtransOrderId,
          token: existingTransaction.midtransToken,
          redirect_url: existingTransaction.paymentUrl,
          status: existingTransaction.status,
          payment_type: existingTransaction.paymentMethod,
        },
        { status: 200 }
      );
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: itemDetails,
      customer_details: customerDetails,
      callbacks: {
        finish: `http://localhost:3000/payment/success?booking_id=${bookingId}`,
        error: `http://localhost:3000/payment/failed?booking_id=${bookingId}`,
        pending: `http://localhost:3000/payment/pending?booking_id=${bookingId}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    await prisma.transaction.create({
      data: {
        bookingId,
        paymentMethod: "midtrans",
        transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        amount,
        midtransToken: transaction.token,
        midtransOrderId: orderId,
        paymentUrl: transaction.redirect_url,
        status: "Pending",
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(
      {
        order_id: orderId,
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        status: transaction.status,
        payment_type: transaction.payment_type,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "400") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process payment",
      },
      { status: 500 }
    );
  }
}
