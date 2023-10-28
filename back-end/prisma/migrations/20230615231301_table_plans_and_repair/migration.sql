/*
  Warnings:

  - You are about to drop the column `description` on the `payments_plan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan` to the `payments_plan` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "max_campaigns" INTEGER,
    "max_tickets" INTEGER,
    "campaign_duration" INTEGER,
    "custom_page" BOOLEAN,
    "support_email" BOOLEAN,
    "support_phone" BOOLEAN,
    "support_chat" BOOLEAN,
    "priority_promotion" BOOLEAN,
    "custom_dashboard" BOOLEAN,
    "custom_logo" BOOLEAN,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sellers_email_unique" ON "sellers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_phone_number_unique" ON "sellers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_cpf_unique" ON "sellers"("cpf");

-- RenameForeignKey
ALTER TABLE "payments_plan" RENAME CONSTRAINT "payments_plan_seller_id_fkey" TO "payments_plan_new_seller_id_fkey";

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "fk_sellers_plans" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "payments_plan_payment_id_key" RENAME TO "unique_payment_id";
