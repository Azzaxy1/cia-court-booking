import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { courtId, days, timeSlot, price, dayType } = await req.json();

    const today = new Date();
    const schedules = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      for (const slot of timeSlot) {
        const existing = await prisma.schedule.findFirst({
          where: {
            courtId,
            timeSlot: slot,
          },
        });

        if (existing) {
          return NextResponse.json(
            {
              success: false,
              message: `Jadwal untuk tanggal ${date
                .toISOString()
                .slice(0, 10)} dan slot ${slot} sudah ada.`,
            },
            { status: 400 }
          );
        }

        schedules.push({
          courtId,
          date,
          timeSlot: slot,
          price,
          dayType,
          available: true,
        });
      }
    }

    await prisma.schedule.createMany({ data: schedules });

    return NextResponse.json({ success: true, count: schedules.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, courtId, date, timeSlot, price, dayType } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID jadwal tidak ditemukan" },
        { status: 400 }
      );
    }

    const existing = await prisma.schedule.findFirst({
      where: {
        courtId,
        timeSlot,
        date,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `Jadwal untuk tanggal ${date
            .toISOString()
            .slice(0, 10)} dan slot ${timeSlot} sudah ada.`,
        },
        { status: 400 }
      );
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        courtId,
        date,
        timeSlot,
        price,
        dayType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil diperbarui",
      schedule: updatedSchedule,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
