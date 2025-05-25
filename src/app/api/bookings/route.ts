import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courtId, scheduleId, amount, paymentMethod } = await req.json();

    if (!courtId || !scheduleId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get schedule details
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { court: true },
    });

    console.log("schedule DB", schedule);

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        court: {
          connect: {
            id: courtId,
          },
        },
        startTime: schedule.timeSlot,
        endTime:
          (parseInt(schedule.timeSlot) + 1).toString().padStart(2, "0") + ":00",
        courtType: schedule.court.type,
        duration: 1,
        date: new Date(schedule.date),
        paymentMethod,
        amount,
        status: "Pending",
      },
    });

    // Update schedule availability
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        available: false,
        bookingId: booking.id,
      },
    });

    return NextResponse.json(booking);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "400") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      },
      { status: 500 }
    );
  }
}
