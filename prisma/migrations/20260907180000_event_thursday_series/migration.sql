-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" DATE,
ADD COLUMN     "skippedDates" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
