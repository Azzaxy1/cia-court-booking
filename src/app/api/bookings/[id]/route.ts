import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEndTime, toUTCDateOnly } from "@/lib/utils";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const params = await context.params;
    const { id } = params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        Schedule: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const endTime = calculateEndTime(data.startTime, data.duration || 1);

    if (data.status === "Canceled" && existingBooking.status !== "Canceled") {
      if (existingBooking.Schedule && existingBooking.Schedule.length > 0) {
        for (const schedule of existingBooking.Schedule) {
          await prisma.schedule.update({
            where: { id: schedule.id },
            data: {
              bookingId: null,
              available: true,
            },
          });
        }
      } else {
        throw new Error("No schedules found on existing booking");
      }
    } else {
      throw new Error("Cancellation condition not met");
    }

    if (data.status !== "Canceled") {
      if (existingBooking.Schedule && existingBooking.Schedule.length > 0) {
        for (const oldSchedule of existingBooking.Schedule) {
          await prisma.schedule.update({
            where: { id: oldSchedule.id },
            data: {
              bookingId: null,
              available: true,
            },
          });
        }
      }

      if (data.scheduleId) {
        await prisma.schedule.update({
          where: { id: data.scheduleId },
          data: {
            bookingId: id,
            available: false,
          },
        });
      }
    }

    let finalAmount = data.amount;
    if (data.scheduleId) {
      const newSchedule = await prisma.schedule.findUnique({
        where: { id: data.scheduleId },
      });
      if (newSchedule) {
        finalAmount = newSchedule.price;
      }
    }

    await prisma.user.update({
      where: { id: existingBooking.userId },
      data: {
        name: data.customerName,
      },
    });

    const bookingUpdateData = {
      courtId: data.courtId,
      date: toUTCDateOnly(data.selectedDate),
      startTime: data.startTime,
      endTime: endTime,
      duration: data.duration || 1,
      amount: finalAmount,
      paymentMethod: data.paymentMethod || "Cash",
      status: data.status,
    };

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: bookingUpdateData,
      include: {
        user: true,
        court: true,
        Schedule: true,
      },
    });

    if (data.status === "Paid") {
      const existingTransaction = await prisma.transaction.findFirst({
        where: { bookingId: id },
      });

      if (existingTransaction) {
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: "paid",
            amount: finalAmount,
            paymentMethod: data.paymentMethod || "Cash",
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.transaction.create({
          data: {
            transactionId: crypto.randomUUID(),
            bookingId: id,
            amount: finalAmount,
            status: "paid",
            paymentMethod: data.paymentMethod || "Cash",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } else if (data.status === "Pending") {
      const existingTransaction = await prisma.transaction.findFirst({
        where: { bookingId: id },
      });

      if (existingTransaction) {
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: "pending",
            updatedAt: new Date(),
          },
        });
      }
    } else if (data.status === "Canceled") {
      const existingTransaction = await prisma.transaction.findFirst({
        where: { bookingId: id },
      });

      if (existingTransaction) {
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: "failed",
            updatedAt: new Date(),
          },
        });
      }
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        Transaction: true,
        Schedule: true,
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

    if (existingBooking.Schedule && existingBooking.Schedule.length > 0) {
      for (const schedule of existingBooking.Schedule) {
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: {
            bookingId: null,
            available: true,
          },
        });
      }
    }

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
