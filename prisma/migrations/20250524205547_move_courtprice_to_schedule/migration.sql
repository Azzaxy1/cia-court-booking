/*
  Warnings:

  - You are about to drop the `CourtPrice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dayType` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourtPrice" DROP CONSTRAINT "CourtPrice_courtId_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "dayType" "DayType" NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CourtPrice";
