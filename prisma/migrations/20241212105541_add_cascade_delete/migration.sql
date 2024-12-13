-- DropForeignKey
ALTER TABLE "RoleByPeriod" DROP CONSTRAINT "RoleByPeriod_memberId_fkey";

-- AddForeignKey
ALTER TABLE "RoleByPeriod" ADD CONSTRAINT "RoleByPeriod_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
