import { notFoundError } from "../../errors";
import planRepository from "../../repositories/plans-repository";
import rafflesRepository from "../../repositories/raffles-repository";
import webhookRepository from "../../repositories/webhook-repository";
import { config } from "dotenv";
import { NextFunction} from "express";
var mercadopago = require('mercadopago');

config();

async function firstNumbers(quantity: number,purchaseId:number, raffleId: number, buyerId: number) {
  // Recupera o array do banco de dados
  const arrayNumbers = await webhookRepository.findRandomNumbersByRaffleId(raffleId);
  const arrayEmbaralhado = arrayNumbers.random_numbers;

  // Obtém os primeiros números utilizando o método slice
  const numbersFirst = arrayEmbaralhado.slice(0, quantity);
  //caso o mesmo usuario ja tenha comprado, os numeros vão ser apenas acrescentados
  const findReservation = await webhookRepository.findBuyer(buyerId);
  const findRaffleId = await webhookRepository.findRaffle(raffleId)

  if(findReservation && findRaffleId) {
    const updatedTicketNumbers = [...findReservation.ticket_numbers, ...numbersFirst];
    await webhookRepository.updateArrayNumbersBuyer(findReservation.id, updatedTicketNumbers);
  }
  else{
    await webhookRepository.createNumbersReservations(numbersFirst, purchaseId, raffleId, buyerId)
  }

  // Atualiza o array no banco de dados removendo os primeiros números
  const updateShuffleNumbers = arrayEmbaralhado.slice(quantity);
  await webhookRepository.updateRamdomNumbers(updateShuffleNumbers, arrayNumbers.id);

  // Retorna
  return 
}

async function findPurchaseAndChangePlan( idPayment: string, next: NextFunction) {
  try {
    if (!idPayment) throw notFoundError();
    console.log(idPayment)
    const payment = await mercadopago.payment.get(idPayment);
  
    if (!payment) throw notFoundError();
  
    const status_payment = payment.body.status;

    console.log(status_payment)
    if (status_payment === "approved") {
      const userPlan = await webhookRepository.findByIdPurchase(idPayment)
      //caso não seja um pagamento de um plao, ele verifica os pagamentos dos compradores (buyers)
      if(!userPlan){
        const buyer = await webhookRepository.findByBuyerIdPayment(idPayment)
        await webhookRepository.updateStatusBuyerPayment(idPayment)
        const raffle = await rafflesRepository.findRaffle(buyer.raffle_id)
        const valueTickets = raffle.avaliable_tickets - buyer.quantity_tickets
        await rafflesRepository.updateTicketsAvaliables(raffle.id, valueTickets)
        firstNumbers(buyer.quantity_tickets, buyer.id, raffle.id, buyer.buyer_id)
        return
      }
      
      await webhookRepository.updateByIdStatus(idPayment)
      const plan = await planRepository.findPlanById(userPlan)
      await webhookRepository.updatePlanByIdPayment(userPlan, plan)
      return 
    }
    if (status_payment === "cancelled") {
      const userPlan = await webhookRepository.findByIdPurchase(idPayment)
      if(!userPlan){
        await webhookRepository.updateStatusPurchases(idPayment)
        return
      }
      await webhookRepository.updateByIdStatusCanceled(idPayment)
      return
    }

    return status_payment;
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
}


const webHookService = {
  findPurchaseAndChangePlan
}

export default webHookService