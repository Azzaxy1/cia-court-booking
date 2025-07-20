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

    if (data.status === "Canceled" && existingBooking.status !== "Canceled") {
      console.log("CANCELLATION DETECTED - Releasing schedule");
      // Jika booking dibatalkan, jadikan schedule available lagi
      if (existingBooking.scheduleId) {
        console.log("Updating schedule ID:", existingBooking.scheduleId);

        const scheduleUpdate = await prisma.schedule.update({
          where: { id: existingBooking.scheduleId },
          data: {
            available: true, // ✅ JADIKAN AVAILABLE LAGI KARENA DIBATALKAN
          },
        });
      } else {
        console.log("No scheduleId found on existing booking");
      }
    } else {
      console.log("Cancellation condition not met");
    }

    // ✅ JIKA ADA PERUBAHAN SCHEDULE, HANDLE SCHEDULE LAMA DAN BARU
    if (
      data.scheduleId &&
      existingBooking.scheduleId !== data.scheduleId &&
      data.status !== "Canceled"
    ) {
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
    const bookingUpdateData: any = {
      courtId: data.courtId,
      date: new Date(data.selectedDate),
      startTime: data.startTime,
      endTime: endTime, // ✅ CALCULATED END TIME
      duration: data.duration || 1,
      amount: data.amount,
      status: data.status,
    };

    // Hanya update schedule connection jika bukan pembatalan
    if (data.status !== "Canceled") {
      bookingUpdateData.Schedule = {
        connect: { id: data.scheduleId || existingBooking.scheduleId },
      };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: bookingUpdateData,
      include: {
        user: true,
        court: true,
        Schedule: true,
      },
    });

    console.log("Updated Booking:", updatedBooking);
    console.log("New EndTime:", endTime);

    // ✅ HANDLE TRANSACTION BERDASARKAN STATUS BOOKING
    if (data.status === "Paid") {
      // Check apakah transaction sudah ada
      const existingTransaction = await prisma.transaction.findFirst({
        where: { bookingId: id },
      });

      if (existingTransaction) {
        // Jika transaction sudah ada, update status
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: "paid",
            paymentMethod: data.paymentMethod || "Cash",
            updatedAt: new Date(),
          },
        });
        console.log("Transaction updated to paid");
      } else {
        // Jika transaction belum ada, create new transaction
        await prisma.transaction.create({
          data: {
            transactionId: crypto.randomUUID(), // or use any unique ID generator
            bookingId: id,
            amount: data.amount,
            status: "paid",
            paymentMethod: data.paymentMethod || "Cash",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log("New transaction created with paid status");
      }
    } else if (data.status === "Pending") {
      // Jika status diubah ke Pending, update transaction jadi pending juga (jika ada)
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
        console.log("Transaction updated to pending");
      }
    } else if (data.status === "Canceled") {
      // Jika status diubah ke Canceled, update transaction jadi failed (jika ada)
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
        console.log("Transaction updated to failed");
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
