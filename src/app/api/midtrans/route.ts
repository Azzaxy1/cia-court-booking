import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";

export const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

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
    };

    const transaction = await snap.createTransaction(parameter);
    await prisma.transaction.create({
      data: {
        bookingId,
        paymentMethod: "BankTransfer",
        transactionId: transaction.token,
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
