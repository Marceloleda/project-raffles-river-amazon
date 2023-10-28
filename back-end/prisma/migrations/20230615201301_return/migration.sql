/*
  Warnings:

  - You are about to drop the column `plan` on the `sellers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "consult_numbers" DROP CONSTRAINT "consult_numbers_raffle_id_fkey";

-- DropForeignKey
ALTER TABLE "numbers_reservations" DROP CONSTRAINT "numbers_reservations_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "numbers_reservations" DROP CONSTRAINT "numbers_reservations_purchases_id_fkey";

-- DropForeignKey
ALTER TABLE "numbers_reservations" DROP CONSTRAINT "numbers_reservations_raffle_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_raffle_id_fkey";

-- DropIndex
DROP INDEX "buyer_email_key";

-- DropIndex
DROP INDEX "buyer_phone_key";

-- DropIndex
DROP INDEX "sellers_cpf_key";

-- DropIndex
DROP INDEX "sellers_email_key";

-- DropIndex
DROP INDEX "sellers_phone_number_key";

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "plan",
ADD COLUMN     "plan_id" INTEGER DEFAULT 1;

-- RenameForeignKey
ALTER TABLE "raffles" RENAME CONSTRAINT "raffles_seller_id_fkey" TO "fk_raffles_sellers";

-- RenameIndex
ALTER INDEX "unique_payment_id" RENAME TO "payments_plan_payment_id_key";
