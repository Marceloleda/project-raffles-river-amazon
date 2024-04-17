import { notFoundError } from "../../errors";
import planRepository from "../../repositories/plans-repository";
import rafflesRepository from "../../repositories/raffles-repository";
import webhookRepository from "../../repositories/webhook-repository";
import { config } from "dotenv";
import { NextFunction} from "express";
import whatsappApi from "../whatsapp-api-service";
import buyerRepository from "../../repositories/buyer-repository";
import { io } from "../../app";
var mercadopago = require('mercadopago');

config();

async function firstNumbers(quantity: number,purchaseId:string, raffleId: string, buyerId: string) {
  // Recupera o array do banco de dados
  const arrayNumbers = await webhookRepository.findRandomNumbersByRaffleId(raffleId);
  const arrayEmbaralhado = arrayNumbers.random_numbers;

  // Obtém os primeiros números utilizando o método slice
  const numbersFirst = arrayEmbaralhado.slice(0, quantity);
  //caso o mesmo usuario já tenha comprado, os numeros vão ser apenas acrescentados
  const findReservation = await webhookRepository.findBuyerByIdAndByRaffleId(buyerId, raffleId); //verifica se tem na tabela de numeros reservados se o comprador existe e a rifa
  // const findRaffleId = await webhookRepository.findRaffle(raffleId)  //verifica se tem na tabela de numeros reservados a rifa que foi comprada
  const buyer = await buyerRepository.findBuyerById(buyerId) //verifica se existe o comprador

  if(findReservation) {
    const updatedTicketNumbers = [...findReservation.ticket_numbers, ...numbersFirst];
    await webhookRepository.updateArrayNumbersBuyer(findReservation.id, updatedTicketNumbers);

    //envia os numeros da sorte via whatsapp atualizados (ainda falt fazer  verificaçao antes de enviar, se o nmero tem whatsapp)
    if(buyer.hasWhatsapp === true){
      whatsappApi.sendMessage(buyer.full_name, buyer.phone, updatedTicketNumbers)
    }
  }
  else{
    await webhookRepository.createNumbersReservations(numbersFirst, purchaseId, raffleId, buyerId)

    //envia os numeros da sorte via whatsapp atualizados
    if(buyer.hasWhatsapp === true){
      whatsappApi.sendMessage(buyer.full_name, buyer.phone, numbersFirst)
    }
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
    const payment = await mercadopago.payment.get(idPayment);
    if (!payment) throw notFoundError();
    // const status_payment = payment.body.status; // descomentar para producao
    const status_payment = "approved"; // retirar para produção

    console.log(status_payment)
    if (status_payment === "approved") {
      const userPlan = await webhookRepository.findByIdPurchase(idPayment)
      //caso não seja um pagamento de um plano, ele verifica os pagamentos dos compradores (buyers)
      if(!userPlan){
        const purchase = await webhookRepository.findByBuyerIdPayment(idPayment)
        await webhookRepository.updateStatusBuyerPayment(idPayment) //atualiza status para aprovado
        const raffle = await rafflesRepository.findRaffle(purchase.raffle_id)
        if(raffle.avaliable_tickets === 0){ //reembolso total caso não tenha mais cotas
          await webhookRepository.updateStatusBuyerPaymentRefund(idPayment)
          io.on('connection', (socket) => {
            // Evento de notificação para um cliente específico
            socket.emit('payment_ticket', {idPayment, status: "refund"});
          });
          return
        }
        const valueTickets = raffle.avaliable_tickets - purchase.quantity_tickets
        await rafflesRepository.updateTicketsAvaliables(raffle.id, valueTickets)
        firstNumbers(purchase.quantity_tickets, purchase.id, raffle.id, purchase.buyer_id)

        //websocket envia notificacao sobre pagamento confirmado
        io.on('connection', (socket) => {
          // Evento de notificação para um cliente específico
          socket.emit('payment_ticket', idPayment);
        });

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