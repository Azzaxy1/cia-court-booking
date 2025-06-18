import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    if (existingBooking.status === "Paid") {
      return NextResponse.json(
        { message: "Cannot edit paid booking" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: existingBooking.userId },
      data: {
        name: data.customerName,
      },
    });

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        Schedule: data.scheduleId
          ? { connect: { id: data.scheduleId } }
          : undefined,
        userId: data.userId,
        courtId: data.courtId,
        date: new Date(data.selectedDate),
        startTime: data.startTime,
        duration: data.duration,
        amount: data.amount,
        status: data.status,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        Transaction: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Pemesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingBooking.status === "Paid") {
      return NextResponse.json(
        { message: "Tidak dapat menghapus pemesanan yang sudah dibayar!" },
        { status: 400 }
      );
    }
    
    if (existingBooking.Transaction && existingBooking.Transaction.length > 0) {
      return NextResponse.json(
        {
          message:
            "Tidak dapat menghapus pemesanan yang sudah memiliki transaksi!",
        },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "Canceled",
      },
    });

    return NextResponse.json({
      message: "Pemesanan berhasil dihapus!",
      booking: updatedBooking,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
