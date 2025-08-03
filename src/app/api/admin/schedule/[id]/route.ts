import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID jadwal tidak ditemukan" },
        { status: 400 }
      );
    }

    const { courtId, date, timeSlot, price, dayType } = await req.json();

    // Validasi schedule yang akan diupdate ada atau tidak
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah ada konflik dengan schedule lain (jika ada perubahan court, date, atau timeSlot)
    if (
      courtId !== existingSchedule.courtId ||
      date !== existingSchedule.date.toISOString() ||
      timeSlot !== existingSchedule.timeSlot
    ) {
      const conflictSchedule = await prisma.schedule.findFirst({
        where: {
          courtId,
          date: new Date(date),
          timeSlot,
          NOT: { id }, // Exclude current schedule
        },
      });

      if (conflictSchedule) {
        return NextResponse.json(
          {
            success: false,
            message: `Jadwal untuk lapangan ini pada tanggal ${new Date(
              date
            ).toLocaleDateString()} dan jam ${timeSlot} sudah ada.`,
          },
          { status: 400 }
        );
      }
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        courtId,
        date: new Date(date),
        timeSlot,
        price,
        dayType,
      },
      include: {
        court: true,
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID jadwal tidak ditemukan" },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.schedule.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
