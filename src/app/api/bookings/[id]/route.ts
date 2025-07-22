import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEndTime } from "@/lib/utils";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = context.params;

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
      // Jika booking dibatalkan, jadikan semua schedule yang terkait available lagi
      if (existingBooking.Schedule && existingBooking.Schedule.length > 0) {
        for (const schedule of existingBooking.Schedule) {
          console.log("Updating schedule ID:", schedule.id);
          await prisma.schedule.update({
            where: { id: schedule.id },
            data: {
              bookingId: null,
              available: true, // ✅ JADIKAN AVAILABLE LAGI KARENA DIBATALKAN
            },
          });
        }
      } else {
        console.log("No schedules found on existing booking");
      }
    } else {
      console.log("Cancellation condition not met");
    }

    // ✅ HANDLE PERUBAHAN SCHEDULE - DISCONNECT DARI SCHEDULE LAMA DAN CONNECT KE SCHEDULE BARU
    if (data.status !== "Canceled") {
      // Pertama, disconnect booking dari semua schedule lama
      if (existingBooking.Schedule && existingBooking.Schedule.length > 0) {
        for (const oldSchedule of existingBooking.Schedule) {
          await prisma.schedule.update({
            where: { id: oldSchedule.id },
            data: {
              bookingId: null,
              available: true, // ✅ JADIKAN AVAILABLE LAGI
            },
          });
          console.log(`Released old schedule: ${oldSchedule.id}`);
        }
      }

      // Kemudian, connect ke schedule baru jika ada
      if (data.scheduleId) {
        await prisma.schedule.update({
          where: { id: data.scheduleId },
          data: {
            bookingId: id, // Connect ke booking ini
            available: false, // ✅ JADIKAN TIDAK AVAILABLE
          },
        });
        console.log(`Connected to new schedule: ${data.scheduleId}`);
      }
    }

    // ✅ GET PRICE FROM NEW SCHEDULE
    let finalAmount = data.amount; // Default amount dari request
    if (data.scheduleId) {
      const newSchedule = await prisma.schedule.findUnique({
        where: { id: data.scheduleId },
      });
      if (newSchedule) {
        finalAmount = newSchedule.price; // ✅ GUNAKAN HARGA DARI SCHEDULE BARU
        console.log(`Updated amount from schedule: ${finalAmount}`);
      }
    }

    // ✅ UPDATE USER NAME
    await prisma.user.update({
      where: { id: existingBooking.userId },
      data: {
        name: data.customerName,
      },
    });

    // ✅ UPDATE BOOKING DENGAN END TIME YANG BENAR DAN HARGA DARI SCHEDULE
    const bookingUpdateData: any = {
      courtId: data.courtId,
      date: new Date(data.selectedDate),
      startTime: data.startTime,
      endTime: endTime, // ✅ CALCULATED END TIME
      duration: data.duration || 1,
      amount: finalAmount, // ✅ GUNAKAN HARGA DARI SCHEDULE
      status: data.status,
    };

    // Tidak perlu connect Schedule karena sudah dihandle di atas
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: bookingUpdateData,
      include: {
        user: true,
        court: true,
        Schedule: true,
      },
    });

    // ✅ HANDLE TRANSACTION BERDASARKAN STATUS BOOKING
    if (data.status === "Paid") {
      // Check apakah transaction sudah ada
      const existingTransaction = await prisma.transaction.findFirst({
        where: { bookingId: id },
      });

      if (existingTransaction) {
        // Jika transaction sudah ada, update status dan amount
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            status: "paid",
            amount: finalAmount, // ✅ GUNAKAN HARGA YANG SUDAH DIUPDATE
            paymentMethod: data.paymentMethod || "Cash",
            updatedAt: new Date(),
          },
        });
        console.log(
          "Transaction updated to paid with new amount:",
          finalAmount
        );
      } else {
        // Jika transaction belum ada, create new transaction
        await prisma.transaction.create({
          data: {
            transactionId: crypto.randomUUID(), // or use any unique ID generator
            bookingId: id,
            amount: finalAmount, // ✅ GUNAKAN HARGA YANG SUDAH DIUPDATE
            status: "paid",
            paymentMethod: data.paymentMethod || "Cash",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(
          "New transaction created with paid status and amount:",
          finalAmount
        );
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
