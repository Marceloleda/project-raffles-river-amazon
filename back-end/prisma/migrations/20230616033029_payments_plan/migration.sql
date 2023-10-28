/*
  Warnings:

  - You are about to drop the column `plan` on the `payments_plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments_plan" DROP COLUMN "plan",
ADD COLUMN     "plan_id" INTEGER;

-- AddForeignKey
ALTER TABLE "payments_plan" ADD CONSTRAINT "fk_payments_plan_plans" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
