-- CreateTable
CREATE TABLE "payments_plan" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "payment_id" VARCHAR(255) NOT NULL,
    "status_payment" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments_plan" ADD CONSTRAINT "payments_plan_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
