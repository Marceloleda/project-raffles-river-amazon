/*
  Warnings:

  - You are about to drop the column `payment_status` on the `numbers_reservations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `available_tickets` on the `raffles` table. All the data in the column will be lost.
  - You are about to drop the `consult_numbers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date_of_expiration` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "numbers_reservations" DROP COLUMN "payment_status",
ALTER COLUMN "ticket_numbers" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "payments_plan" ADD COLUMN     "date_of_expiration" VARCHAR(255),
ADD COLUMN     "name_plan" VARCHAR(255),
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "updated_at",
ADD COLUMN     "date_of_expiration" VARCHAR(255) NOT NULL,
ADD COLUMN     "payment_id" VARCHAR(255),
ADD COLUMN     "payment_status" VARCHAR(255),
ALTER COLUMN "purchase_date" DROP DEFAULT,
ALTER COLUMN "purchase_date" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "raffles" DROP COLUMN "available_tickets",
ADD COLUMN     "avaliable_tickets" INTEGER;

-- DropTable
DROP TABLE "consult_numbers";

-- CreateTable
CREATE TABLE "prizes" (
    "id" SERIAL NOT NULL,
    "raffle_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shuffle_numbers" (
    "id" SERIAL NOT NULL,
    "raffle_id" INTEGER NOT NULL,
    "ticket_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seller_id" INTEGER,
    "random_numbers" TEXT[],

    CONSTRAINT "consult_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchases_payment_id_key" ON "purchases"("payment_id");

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shuffle_numbers" ADD CONSTRAINT "fk_consult_numbers_sellers" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
