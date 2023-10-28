/*
  Warnings:

  - You are about to drop the column `expireAt` on the `raffles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raffles" DROP COLUMN "expireAt",
ADD COLUMN     "expire_at" VARCHAR(255);

