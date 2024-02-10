-- CreateTable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "buyer" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "hasWhatsapp" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "numbers_reservations" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "buyer_id" UUID NOT NULL,
    "purchases_id" UUID NOT NULL,
    "raffle_id" UUID NOT NULL,
    "ticket_numbers" TEXT[],
    "reservation_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "numbers_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "buyer_id" UUID NOT NULL,
    "raffle_id" UUID NOT NULL,
    "quantity_tickets" INTEGER NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "purchase_date" VARCHAR(255) NOT NULL,
    "date_of_expiration" VARCHAR(255) NOT NULL,
    "payment_status" VARCHAR(255),
    "payment_id" VARCHAR(255),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffles" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "seller_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "ticket_price" DECIMAL(10,2) NOT NULL,
    "total_tickets" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" VARCHAR(255),
    "avaliable_tickets" INTEGER,
    "is_deleted" BOOLEAN,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_ticket_plan" INTEGER DEFAULT 100,
    "plan_id" UUID,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments_plan" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "seller_id" UUID NOT NULL,
    "payment_id" VARCHAR(255) NOT NULL,
    "status_payment" VARCHAR(255) NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan_id" UUID,
    "name_plan" VARCHAR(255),
    "date_of_expiration" VARCHAR(255),

    CONSTRAINT "payments_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
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

-- CreateTable
CREATE TABLE "prizes" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "raffle_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shuffle_numbers" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "raffle_id" UUID NOT NULL,
    "ticket_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seller_id" UUID,
    "random_numbers" TEXT[],

    CONSTRAINT "consult_numbers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "images_raffles" (
    "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
    "raffle_id" UUID NOT NULL,
    "links_images" TEXT[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consult_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_purchases_ticket_numbers_gin" ON "numbers_reservations" USING GIN ("ticket_numbers");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_payment_id_key" ON "purchases"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_email_unique" ON "sellers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_phone_number_unique" ON "sellers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_cpf_unique" ON "sellers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "unique_payment_id" ON "payments_plan"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_unique" ON "plans"("name");

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "fk_raffles_sellers" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "fk_sellers_plans" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments_plan" ADD CONSTRAINT "fk_payments_plan_plans" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments_plan" ADD CONSTRAINT "payments_plan_new_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shuffle_numbers" ADD CONSTRAINT "fk_consult_numbers_sellers" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
