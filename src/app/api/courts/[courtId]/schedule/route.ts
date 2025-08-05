import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toUTCDateOnly } from "@/lib/utils";

export async function GET(
  request: Request,
  context: { params: Promise<{ courtId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const params = await context.params;

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const utcDate = toUTCDateOnly(date);

    const schedules = await prisma.schedule.findMany({
      where: {
        courtId: params.courtId,
        date: {
          gte: utcDate,
          lt: new Date(utcDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        booking: true,
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}
