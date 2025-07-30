import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
