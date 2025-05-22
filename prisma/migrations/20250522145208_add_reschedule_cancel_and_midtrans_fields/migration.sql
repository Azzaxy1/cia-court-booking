/*
  Warnings:

  - You are about to drop the column `available` on the `Court` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "rescheduleCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rescheduleFrom" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Court" DROP COLUMN "available";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "midtransOrderId" TEXT,
ADD COLUMN     "midtransToken" TEXT,
ADD COLUMN     "paymentUrl" TEXT;

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "courtId" TEXT NOT NULL,
    "bookingId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Schedule_courtId_date_timeSlot_idx" ON "Schedule"("courtId", "date", "timeSlot");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
