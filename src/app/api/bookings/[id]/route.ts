import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEndTime } from "@/lib/utils";

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
        Schedule: true, // ✅ INCLUDE SCHEDULE LAMA
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const endTime = calculateEndTime(data.startTime, data.duration || 1);

    // ✅ JIKA ADA PERUBAHAN SCHEDULE, HANDLE SCHEDULE LAMA DAN BARU
    if (data.scheduleId && existingBooking.scheduleId !== data.scheduleId) {
      // Release schedule lama (jadikan available = true)
      if (existingBooking.scheduleId) {
        await prisma.schedule.update({
          where: { id: existingBooking.scheduleId },
          data: {
            available: true, // ✅ JADIKAN AVAILABLE LAGI
          },
        });
      }

      // Book schedule baru (jadikan available = false)
      await prisma.schedule.update({
        where: { id: data.scheduleId },
        data: {
          available: false, // ✅ JADIKAN TIDAK AVAILABLE
        },
      });
    }

    // ✅ UPDATE USER NAME
    await prisma.user.update({
      where: { id: existingBooking.userId },
      data: {
        name: data.customerName,
      },
    });

    // ✅ UPDATE BOOKING DENGAN END TIME YANG BENAR
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        Schedule: {
          connect: { id: data.scheduleId || existingBooking.scheduleId },
        },
        courtId: data.courtId,
        date: new Date(data.selectedDate),
        startTime: data.startTime,
        endTime: endTime, // ✅ CALCULATED END TIME
        duration: data.duration || 1,
        amount: data.amount,
        status: data.status,
      },
      include: {
        user: true,
        court: true,
        Schedule: true,
      },
    });

    console.log("Updated Booking:", updatedBooking);
    console.log("New EndTime:", endTime);

    // ✅ UPDATE TRANSACTION STATUS JIKA PERLU
    if (data.status === "Paid") {
      await prisma.transaction.updateMany({
        where: { bookingId: id },
        data: {
          status: "paid",
          paymentMethod: data.paymentMethod || "Cash",
        },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Update booking error:", error);
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
