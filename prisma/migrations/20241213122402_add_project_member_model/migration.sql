/*
  Warnings:

  - You are about to drop the column `projectId` on the `Member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectRoles" AS ENUM ('Prosjektleder', 'Bidragsyter');

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_projectId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "techStack" SET NOT NULL,
ALTER COLUMN "techStack" SET DATA TYPE TEXT,
ALTER COLUMN "link" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "Role" "ProjectRoles" NOT NULL,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
