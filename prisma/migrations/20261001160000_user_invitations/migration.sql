-- AlterTable
ALTER TABLE "User" ADD COLUMN "modifiedByUserId" TEXT;

-- CreateTable
CREATE TABLE "UserInvitationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInvitationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInvitationToken_token_key" ON "UserInvitationToken"("token");

-- CreateIndex
CREATE INDEX "UserInvitationToken_email_idx" ON "UserInvitationToken"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_modifiedByUserId_fkey" FOREIGN KEY ("modifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
