/*
  Warnings:

  - You are about to drop the column `description` on the `payments_plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments_plan" DROP COLUMN "description",
ADD COLUMN     "plan" INTEGER NOT NULL DEFAULT 1;
