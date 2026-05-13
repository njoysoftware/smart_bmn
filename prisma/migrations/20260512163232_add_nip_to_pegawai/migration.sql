/*
  Warnings:

  - A unique constraint covering the columns `[nip]` on the table `pegawais` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pegawais" ADD COLUMN     "nip" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pegawais_nip_key" ON "pegawais"("nip");
