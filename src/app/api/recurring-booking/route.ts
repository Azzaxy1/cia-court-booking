import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createRecurringBooking,
  getRecurringBookingPreview,
} from "@/services/recurringBookingService";
import { recurringBookingSchema } from "@/validation";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Parse and validate dates - menggunakan parseISO untuk konsistensi
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
      ...body,
      // Keep dates as strings for validation
      startDate: body.startDate,
      endDate: body.endDate,
    };

    const validatedData = recurringBookingSchema.parse(parsedBody);

    // Convert validated string dates back to Date objects for service
    const serviceData = {
      ...validatedData,
      startDate,
      endDate,
    };

    const result = await createRecurringBooking(session.user.id, serviceData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating recurring booking:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "preview") {
      const courtId = searchParams.get("courtId");
      const dayOfWeek = parseInt(searchParams.get("dayOfWeek") || "0");
      const startDateStr = searchParams.get("startDate");
      const endDateStr = searchParams.get("endDate");
      const timeSlot = searchParams.get("timeSlot");

      if (!startDateStr || !endDateStr) {
        return NextResponse.json(
          { error: "Missing date parameters" },
          { status: 400 }
        );
      }

      // Parse dates safely
      const startDate = new Date(startDateStr + "T00:00:00");
      const endDate = new Date(endDateStr + "T00:00:00");

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      if (
        !courtId ||
        !timeSlot ||
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime())
      ) {
        return NextResponse.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }

      const preview = await getRecurringBookingPreview(
        courtId,
        dayOfWeek,
        startDate,
        endDate,
        timeSlot
      );

      return NextResponse.json({
        success: true,
        data: preview,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error getting recurring booking preview:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
