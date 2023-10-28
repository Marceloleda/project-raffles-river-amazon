/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `payments_plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unique_payment_id" ON "payments_plan"("payment_id");
