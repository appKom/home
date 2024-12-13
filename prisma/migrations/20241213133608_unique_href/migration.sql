/*
  Warnings:

  - A unique constraint covering the columns `[href]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_href_key" ON "Project"("href");
