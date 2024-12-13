/*
  Warnings:

  - You are about to drop the column `member_id` on the `RoleByPeriod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId,period]` on the table `RoleByPeriod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `RoleByPeriod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoleByPeriod" DROP CONSTRAINT "RoleByPeriod_member_id_fkey";

-- DropIndex
DROP INDEX "RoleByPeriod_member_id_period_key";

-- AlterTable
ALTER TABLE "RoleByPeriod" DROP COLUMN "member_id",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoleByPeriod_memberId_period_key" ON "RoleByPeriod"("memberId", "period");

-- AddForeignKey
ALTER TABLE "RoleByPeriod" ADD CONSTRAINT "RoleByPeriod_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
