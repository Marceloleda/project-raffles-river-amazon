import { prisma } from "../../config";
import { plans } from '../../../node_modules/.prisma/client';

async function findByIdPurchase(paymentId: string){
    return prisma.payments_plan.findUnique({
        where: {
            payment_id: paymentId
        }
    })
}
async function findByBuyerIdPayment(paymentId: string){
    return prisma.purchases.findUnique({
        where: {
            payment_id: paymentId
        }
    })
}
async function updatePlanByIdPayment(payment: any, plan: plans){
    return prisma.sellers.update({
        where: {id: payment.seller_id},
        data: {
            plan_id: payment.plan_id,
            total_ticket_plan: plan.max_tickets
        }
    })
}
async function updateByIdStatus(payment: any){
    return prisma.payments_plan.update({
        where: {payment_id: payment},
        data: {
            status_payment: "approved"
        }
    })
}
async function updateStatusBuyerPayment(payment: any){
    return prisma.purchases.update({
        where: {payment_id: payment},
        data: {
            payment_status: "approved"
        }
    })
}
async function updateByIdStatusCanceled(payment: any){
    return prisma.payments_plan.update({
        where: {payment_id: payment},
        data: {
            status_payment: "cancelled"
        }
    })
}
async function updateStatusPurchases(payment: any){
    return prisma.purchases.update({
        where: {payment_id: payment},
        data: {
            payment_status: "cancelled"
        }
    })
}
async function findRandomNumbersByRaffleId(raffleId: number) {
    return await prisma.shuffle_numbers.findFirst({
        where: {raffle_id: raffleId}
    })
}
async function updateRamdomNumbers(ramdomNumbers:any, id: number) {
    return await prisma.shuffle_numbers.update({
        where:{id},
        data: {
            random_numbers: ramdomNumbers
        }
    })
}
async function createNumbersReservations(ramdomNumbers:any, purchaseId: number, raffleId: number, buyerId:number) {
    return await prisma.numbers_reservations.create({
        data:{
            buyer_id: buyerId,
            purchases_id: purchaseId,
            raffle_id: raffleId,
            ticket_numbers: ramdomNumbers
        }
    })
}
async function findBuyer(buyer_id:number) {
    return await prisma.numbers_reservations.findFirst({
        where:{buyer_id: buyer_id}
    })
}
async function updateArrayNumbersBuyer(id: number, updateFirstNumbers: string[]) {
    return await prisma.numbers_reservations.update({
      where: { id: id },
      data: {
        ticket_numbers: updateFirstNumbers
      }
    });
}
async function findRaffle(id:number) {
    return await prisma.numbers_reservations.findFirst({
        where: {raffle_id: id}
    })
}
const webhookRepository = {
    findByIdPurchase,
    updatePlanByIdPayment,
    updateByIdStatus,
    updateByIdStatusCanceled,
    findByBuyerIdPayment,
    updateStatusBuyerPayment,
    findRandomNumbersByRaffleId,
    updateRamdomNumbers,
    createNumbersReservations,
    updateStatusPurchases,
    findBuyer,
    updateArrayNumbersBuyer,
    findRaffle
}

export default webhookRepository;