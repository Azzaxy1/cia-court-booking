import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRecurringBooking } from "@/services/recurringBookingService";
import { recurringBookingSchema } from "@/validation";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin/cashier
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || (user.role !== "OWNER" && user.role !== "CASHIER")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Find or create customer user
    let customer = await prisma.user.findFirst({
      where: {
        name: body.customerName,
      },
    });

    if (!customer) {
      // Create a new customer with minimal data
      customer = await prisma.user.create({
        data: {
          name: body.customerName,
          email: `${body.customerName
            .toLowerCase()
            .replace(/\s+/g, "")}@customer.cash`,
          role: "CUSTOMER",
          emailVerified: new Date(),
        },
      });
    }

    // Parse and validate dates
    const parsedBody = {
      courtId: body.courtId,
      dayOfWeek: body.dayOfWeek,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      timeSlot: body.timeSlot,
    };

    const validatedData = recurringBookingSchema.parse(parsedBody);

    const result = await createRecurringBooking(customer.id, validatedData, {
      status: "Paid",
      paymentMethod: "Cash",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating admin recurring booking:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
