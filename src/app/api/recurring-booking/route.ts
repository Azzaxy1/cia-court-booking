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

    // Parse and validate dates
    const parsedBody = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    };

    const validatedData = recurringBookingSchema.parse(parsedBody);

    const result = await createRecurringBooking(session.user.id, validatedData);

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
      const startDate = new Date(searchParams.get("startDate") || "");
      const endDate = new Date(searchParams.get("endDate") || "");
      const timeSlot = searchParams.get("timeSlot");

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
