import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session:", session);

    if (!session?.user) {
      console.log("No session user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is CASHIER or OWNER
    if (
      !session.user.role ||
      !["CASHIER", "OWNER"].includes(session.user.role)
    ) {
      console.log("User role not authorized:", session.user.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("Fetching recurring bookings...");

    const recurringBookings = await prisma.recurringBooking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        court: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        bookings: {
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
        Transaction: {
          select: {
            id: true,
            amount: true,
            status: true,
            paymentMethod: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recurringBookings);
  } catch (error) {
    console.error("Get recurring bookings error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
