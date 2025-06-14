/*
  Warnings:

  - A unique constraint covering the columns `[courtId,date,timeSlot]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Schedule_courtId_date_timeSlot_key" ON "Schedule"("courtId", "date", "timeSlot");
