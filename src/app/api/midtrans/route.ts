import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

export async function POST(req: Request) {
  try {
    const { orderId, amount, customerDetails } = await req.json();

    if (!orderId || !amount || !customerDetails) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
      customer_details: customerDetails,
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error: BaseError) {
    console.error("Error processing payment:", error, error?.response?.data);
    return NextResponse.json(
      { error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
