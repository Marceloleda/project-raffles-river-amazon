-- CreateTable
CREATE TABLE "buyer" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consult_numbers" (
    "id" SERIAL NOT NULL,
    "raffle_id" INTEGER NOT NULL,
    "random_numbers" INTEGER[],
    "ticket_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consult_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "numbers_reservations" (
    "id" SERIAL NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "purchases_id" INTEGER NOT NULL,
    "raffle_id" INTEGER NOT NULL,
    "ticket_numbers" INTEGER[],
    "payment_status" BOOLEAN NOT NULL DEFAULT false,
    "reservation_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "numbers_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" SERIAL NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "raffle_id" INTEGER NOT NULL,
    "quantity_tickets" INTEGER NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "purchase_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffles" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "ticket_price" DECIMAL(10,2) NOT NULL,
    "available_tickets" INTEGER NOT NULL,
    "total_tickets" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(15) NOT NULL,
    "plan" VARCHAR(255) NOT NULL DEFAULT 'Teste',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buyer_email_key" ON "buyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_phone_key" ON "buyer"("phone");

-- CreateIndex
CREATE INDEX "idx_reserved_numbers_gin" ON "consult_numbers" USING GIN ("random_numbers");

-- CreateIndex
CREATE INDEX "idx_purchases_ticket_numbers_gin" ON "numbers_reservations" USING GIN ("ticket_numbers");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_email_key" ON "sellers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_phone_number_key" ON "sellers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_cpf_key" ON "sellers"("cpf");

-- AddForeignKey
ALTER TABLE "consult_numbers" ADD CONSTRAINT "consult_numbers_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "numbers_reservations" ADD CONSTRAINT "numbers_reservations_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "numbers_reservations" ADD CONSTRAINT "numbers_reservations_purchases_id_fkey" FOREIGN KEY ("purchases_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "numbers_reservations" ADD CONSTRAINT "numbers_reservations_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
