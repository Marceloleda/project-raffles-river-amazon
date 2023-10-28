import { prisma } from "../../config";

async function createPlanPayment(id_plan: number,payment:any, id: number) {
    const paymentId = payment.id;
    const paymentIdString = paymentId.toString();
    return await prisma.payments_plan.create({
        data: {
            seller_id: id,
            payment_id: paymentIdString,
            status_payment: payment.status,
            plan_id: id_plan,
            name_plan: payment.description,
            created_at: payment.date_created,
            date_of_expiration: payment.date_of_expiration,
            updated_at: payment.date_last_updated
        }
    })
}
async function createBuyerPayment(buyerId: number, idRaffle: number, quantity: number, total: number, payment:any) {
    const paymentId = payment.id;
    const paymentIdString = paymentId.toString();
    return await prisma.purchases.create({
        data: {
            buyer_id: buyerId,
            raffle_id: idRaffle,
            quantity_tickets: quantity,
            total_value: total,
            payment_status: payment.status,
            payment_id: paymentIdString,
            date_of_expiration: payment.date_of_expiration,
            purchase_date: payment.date_created
        }
    })
}
const mercadoPagoRepository = {
    createPlanPayment,
    createBuyerPayment
}

export default mercadoPagoRepository;