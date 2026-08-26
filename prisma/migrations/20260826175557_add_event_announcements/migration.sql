-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "announcedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyOnNewEvent" BOOLEAN NOT NULL DEFAULT true;
