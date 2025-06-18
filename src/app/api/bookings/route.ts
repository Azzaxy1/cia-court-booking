import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toUTCDateOnly } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      customerName,
      courtId,
      scheduleId,
      amount,
      paymentMethod,
      date,
      status,
      duration,
      startTime,
      endTime,
      courtType,
    } = await req.json();

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { court: true },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    let userId: string | undefined = undefined;

    if (customerName) {
      let user = await prisma.user.findFirst({ where: { name: customerName } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: customerName,
            email: `${customerName
              .replace(/\s/g, "")
              .toLowerCase()}@example.com`,
            role: "CUSTOMER",
          },
        });
      }
      userId = user.id;
    } else if (session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const booking = await prisma.booking.create({
      data: {
        userId,
        courtId,
        startTime: startTime || schedule.timeSlot,
        duration: duration || 1,
        endTime:
          endTime ||
          (parseInt(schedule.timeSlot) + 1).toString().padStart(2, "0") + ":00",
        courtType: courtType || schedule.court.type,
        date: date ? toUTCDateOnly(date) : toUTCDateOnly(schedule.date),
        paymentMethod: paymentMethod || "Cash",
        amount,
        status: status || "Pending",
      },
    });

    await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        available: false,
        bookingId: booking.id,
      },
    });

    if (!session) {
      await prisma.transaction.create({
        data: {
          bookingId: booking.id,
          transactionId: "cash-" + Date.now(),
          amount,
          paymentMethod: "Cash",
          status: "Paid",
        },
      });
    }

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
