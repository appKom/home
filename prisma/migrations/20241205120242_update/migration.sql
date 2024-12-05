/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('Leder', 'Nestleder', 'Økonomiansvarlig', 'Medlem');

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_memberId_fkey";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Role";

-- DropEnum
DROP TYPE "RoleType";

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL DEFAULT '/medlemmer/default_profile_picture.png',
    "about" TEXT,
    "quote" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "github" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_by_period" (
    "member_id" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL,

    CONSTRAINT "roles_by_period_pkey" PRIMARY KEY ("member_id","period")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_href_key" ON "members"("href");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_github_key" ON "members"("github");

-- CreateIndex
CREATE UNIQUE INDEX "members_linkedin_key" ON "members"("linkedin");

-- AddForeignKey
ALTER TABLE "roles_by_period" ADD CONSTRAINT "roles_by_period_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
