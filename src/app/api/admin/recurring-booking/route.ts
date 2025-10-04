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

    // Parse and validate dates - handle string dates with timezone consistency
    let startDate: Date;
    let endDate: Date;

    try {
      // Handle string dates from client
      if (typeof body.startDate === "string") {
        startDate = new Date(body.startDate + "T00:00:00");
      } else {
        startDate = new Date(body.startDate);
      }

      if (typeof body.endDate === "string") {
        endDate = new Date(body.endDate + "T00:00:00");
      } else {
        endDate = new Date(body.endDate);
      }

      // Validate dates
      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }
      if (isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const parsedBody = {
      courtId: body.courtId,
      dayOfWeek: body.dayOfWeek,
      // Keep dates as strings for validation
      startDate: body.startDate,
      endDate: body.endDate,
      timeSlot: body.timeSlot,
    };

    const validatedData = recurringBookingSchema.parse(parsedBody);

    // Convert validated string dates back to Date objects for service
    const serviceData = {
      ...validatedData,
      startDate,
      endDate,
    };

    const result = await createRecurringBooking(customer.id, serviceData, {
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
