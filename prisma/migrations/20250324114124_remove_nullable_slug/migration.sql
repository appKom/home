/*
  Warnings:

  - Made the column `slug` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "slug" SET NOT NULL;
