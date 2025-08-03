import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      order_id, 
      payment_type, 
      transaction_status, 
      signature_key,
      gross_amount,
      status_code
    } = body;

    // Verify signature for security
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key) {
      const hash = crypto
        .createHash('sha512')
        .update(order_id + status_code + gross_amount + serverKey)
        .digest('hex');
      
      if (hash !== signature_key) {
        console.error("Invalid signature for order:", order_id);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // Find transaction by midtransOrderId
    const transaction = await prisma.transaction.findFirst({
      where: { midtransOrderId: order_id },
      include: {
        booking: true,
        recurringBooking: {
          include: {
            bookings: true
          }
        }
      }
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Handle different transaction statuses
    if (transaction_status === "settlement") {
      // Use database transaction to ensure consistency
      await prisma.$transaction(async (tx) => {
        // Update transaction status first
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentMethod: payment_type,
            status: transaction_status,
          },
        });
        
        if (transaction.bookingId) {
          // Regular booking
          await tx.booking.update({
            where: { id: transaction.bookingId },
            data: { 
              status: "Paid", 
              paymentMethod: payment_type 
            },
          });

          // Update schedule availability
          await tx.schedule.updateMany({
            where: { bookingId: transaction.bookingId },
            data: { available: false }
          });
        }

        if (transaction.recurringBookingId) {
          // Recurring booking - update to "Paid" status
          await tx.recurringBooking.update({
            where: { id: transaction.recurringBookingId },
            data: { 
              status: "Paid", 
              paymentMethod: payment_type 
            },
          });

          // Update all related bookings to Paid
          await tx.booking.updateMany({
            where: { recurringBookingId: transaction.recurringBookingId },
            data: { 
              status: "Paid", 
              paymentMethod: payment_type 
            },
          });

          // Update all related schedules to unavailable
          const bookings = await tx.booking.findMany({
            where: { recurringBookingId: transaction.recurringBookingId },
            select: { id: true }
          });
          
          const bookingIds = bookings.map(b => b.id);
          
          if (bookingIds.length > 0) {
            await tx.schedule.updateMany({
              where: { 
                bookingId: { 
                  in: bookingIds
                }
              },
              data: { available: false }
            });
          }
        }
      });
      
    } else if (transaction_status === "pending") {
      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentMethod: payment_type,
            status: transaction_status,
          },
        });
        
        if (transaction.bookingId) {
          await tx.booking.update({
            where: { id: transaction.bookingId },
            data: { 
              status: "Pending", 
              paymentMethod: payment_type 
            },
          });
        }

        if (transaction.recurringBookingId) {
          await tx.recurringBooking.update({
            where: { id: transaction.recurringBookingId },
            data: { 
              status: "Pending", 
              paymentMethod: payment_type 
            },
          });

          await tx.booking.updateMany({
            where: { recurringBookingId: transaction.recurringBookingId },
            data: { 
              status: "Pending", 
              paymentMethod: payment_type 
            },
          });
        }
      });

    } else if (["expire", "cancel", "deny", "failure"].includes(transaction_status)) {
      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentMethod: payment_type,
            status: transaction_status,
          },
        });
        
        if (transaction.bookingId) {
          await tx.booking.update({
            where: { id: transaction.bookingId },
            data: { status: "Canceled" },
          });

          // Make schedule available again
          await tx.schedule.updateMany({
            where: { bookingId: transaction.bookingId },
            data: { available: true }
          });
        }

        if (transaction.recurringBookingId) {
          await tx.recurringBooking.update({
            where: { id: transaction.recurringBookingId },
            data: { status: "Canceled" },
          });

          await tx.booking.updateMany({
            where: { recurringBookingId: transaction.recurringBookingId },
            data: { status: "Canceled" },
          });

          // Make all related schedules available again
          const bookings = await tx.booking.findMany({
            where: { recurringBookingId: transaction.recurringBookingId },
            select: { id: true }
          });
          
          const bookingIds = bookings.map(b => b.id);
          
          if (bookingIds.length > 0) {
            await tx.schedule.updateMany({
              where: { 
                bookingId: { 
                  in: bookingIds
                }
              },
              data: { available: true }
            });
          }
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Midtrans notification error:", error);
    
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process payment",
      },
      { status: 500 }
    );
  }
}
