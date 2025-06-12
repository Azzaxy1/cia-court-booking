import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID lapangan tidak ditemukan" },
        { status: 400 }
      );
    }

    const scheduleCount = await prisma.schedule.count({
      where: { courtId: id },
    });
    if (scheduleCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak bisa menghapus, masih ada jadwal terkait.",
        },
        { status: 400 }
      );
    }
    const court = await prisma.court.findUnique({
      where: { id },
    });

    if (!court) {
      return NextResponse.json(
        { success: false, message: "Lapangan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.court.update({
      where: { id },
      data: { isDeleted: true },
    });

    if (court.image) {
      const imagePath = path.join(process.cwd(), "public", court.image);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        throw new Error("Failed to delete court image", { cause: err });
      }
    }

    return NextResponse.json(
      { success: true, message: "Lapangan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus lapangan",
        error: error instanceof Error ? error.message : "Failed to delete",
      },
      { status: 500 }
    );
  }
}
