import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  return NextResponse.json({
    orderId: transaction.midtransOrderId,
    amount: transaction.amount,
    paymentMethod: transaction.paymentMethod,
    status: transaction.status,
    date: transaction.createdAt.toISOString(),
    courtName: transaction.booking.court.name,
  });
}
