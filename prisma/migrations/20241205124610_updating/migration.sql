/*
  Warnings:

  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles_by_period` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles_by_period" DROP CONSTRAINT "roles_by_period_member_id_fkey";

-- DropTable
DROP TABLE "members";

-- DropTable
DROP TABLE "roles_by_period";

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "imageUri" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "about" TEXT,
    "quote" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleByPeriod" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "RoleByPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_href_key" ON "Member"("href");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoleByPeriod_memberId_period_key" ON "RoleByPeriod"("memberId", "period");

-- AddForeignKey
ALTER TABLE "RoleByPeriod" ADD CONSTRAINT "RoleByPeriod_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
