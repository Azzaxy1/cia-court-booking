import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, payment_type, transaction_status } = body;

    const transaction = await prisma.transaction.findFirst({
      where: { midtransOrderId: order_id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentMethod: payment_type,
        status: transaction_status,
      },
    });

    if (transaction_status === "settlement") {
      await prisma.booking.update({
        where: { id: transaction.bookingId },
        data: { status: "Paid", paymentMethod: payment_type },
      });
    } else if (transaction_status === "pending") {
      await prisma.booking.update({
        where: { id: transaction.bookingId },
        data: { status: "Pending", paymentMethod: payment_type },
      });
    } else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      await prisma.booking.update({
        where: { id: transaction.bookingId },
        data: { status: "Canceled" },
      });
    }

    return NextResponse.json({ success: true });
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
