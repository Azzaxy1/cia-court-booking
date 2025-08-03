-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "recurringBookingId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recurringBookingId" TEXT,
ALTER COLUMN "bookingId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RecurringBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courtId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "courtType" "CourtType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'Pending',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_recurringBookingId_fkey" FOREIGN KEY ("recurringBookingId") REFERENCES "RecurringBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringBooking" ADD CONSTRAINT "RecurringBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringBooking" ADD CONSTRAINT "RecurringBooking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurringBookingId_fkey" FOREIGN KEY ("recurringBookingId") REFERENCES "RecurringBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
