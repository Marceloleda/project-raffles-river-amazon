import { invalidDataError, notFoundError, unauthorizedError } from "../../errors";
import { buyData } from "../../protocols";
import buyerRepository from "../../repositories/buyer-repository";
import rafflesRepository from "../../repositories/raffles-repository";
import dayjs from "dayjs";
import { NextFunction } from "express";
import mercadoPagoRepository from "../../repositories/payments-plan-repository";
var mercadopago = require('mercadopago');
mercadopago.configurations?.setAccessToken(process.env.TOKEN_MERCADOPAGO_PRODUCTION);
import webhookRepository from "@/repositories/webhook-repository";


async function createPaymentToTicket(body: buyData, next: NextFunction) {
  const {idRaffle, name, email, phone_number, total, quantity} = body
  const raffle = await rafflesRepository.findRaffle(idRaffle)
    if(!body) throw notFoundError()
    if(!raffle) throw notFoundError()
    if(raffle.avaliable_tickets < quantity){
      throw invalidDataError(["quantity of tickets more then avaliable tickets"])  
    }
    let buyer;
    const findBuyerByEmail = await buyerRepository.findBuyerByEmail(email)
    const findBuyerByPhone = await buyerRepository.findBuyerByPhone(phone_number)

    if (findBuyerByEmail) {
      buyer = findBuyerByEmail;
    } else if (findBuyerByPhone) {
      buyer = findBuyerByPhone;
    } else {
      // Se nenhum comprador existir, criar um novo registro de comprador
      buyer = await buyerRepository.createBuyer( name, email, phone_number);
    }
    
    const date = dayjs();
    const expireAt = date.add(7, 'minutes');

    const amountNumber = parseFloat(total)

    var payment_data = {
      transaction_amount: amountNumber,
      description: raffle.title,
      payment_method_id: 'pix',
      date_of_expiration: expireAt,
      payer: {
        email: body.email,
        first_name: name,
        last_name: ''
      }
    };
    try{
      const payment = await mercadopago.payment?.create(payment_data)
      if(payment){
        if (!buyer.id) return unauthorizedError();

        if (!idRaffle || !quantity || !total) return notFoundError();
        await mercadoPagoRepository.createBuyerPayment(buyer.id, idRaffle, quantity, total, payment?.body)
        console.log("buyer payment created")
      }
      return payment?.body;
    }
    catch(error) {
      console.log("failed buyer payment creation")
      console.log(error)
      return next(error)
    };
}

async function findTickets(email: string | undefined, phone: string | undefined, next: NextFunction) {
  try {
    const emailBuyer = email ? await buyerRepository.findBuyerByEmail(email) : undefined;
    const phoneBuyer = phone ? await buyerRepository.findBuyerByPhone(phone) : undefined;

    if ((email || phone) && (!emailBuyer && !phoneBuyer)) {
      return notFoundError();
    }
    const getBuyerData = async (buyer: any, numbersProp: string) => {
      const numbers = await buyerRepository.findNumbersReservationByBuyerId(buyer.id);

      if (!numbers) {
        return notFoundError();
      }

      if (numbers.length === 1) {
        const tickets = numbers[0];
        const raffle = await rafflesRepository.findRaffle(tickets.raffle_id);
        const reservation = await buyerRepository.findNumbersReservationByBuyerIdAndRaffleId(buyer.id, raffle.id)
        const purchase = await buyerRepository.findPuchaseById(reservation.purchases_id)

        delete buyer.id;
        delete tickets.id;
        delete tickets.purchases_id;
        delete tickets.buyer_id;

        return { ...buyer, tickets, raffle, purchase};
      }

      const dataRafflePromises = numbers.map(async (ticket) => {
        const raffle = await rafflesRepository.findRaffle(ticket.raffle_id);
        const reservation = await buyerRepository.findNumbersReservationByBuyerIdAndRaffleId(buyer.id, raffle.id);
        const purchase = await buyerRepository.findPuchaseById(reservation.purchases_id);

        delete buyer.id;
        delete ticket.id;
        delete ticket.purchases_id;
        delete ticket.buyer_id;
    
        return { tickets: ticket, raffle, purchase };
      });
    
      const dataRaffle = await Promise.all(dataRafflePromises);
    

      return { ...buyer, dataRaffle };
    };

    if (emailBuyer) {
      return await getBuyerData(emailBuyer, 'numbersEmail');
    }

    if (phoneBuyer) {
      return await getBuyerData(phoneBuyer, 'numbersPhone');
    }

    return notFoundError();
  } catch (error) {
    return next(error);
  }
}


async function findByIdPayment(idPayment: string, next: NextFunction){
  try{
      const purchase = await webhookRepository.findByBuyerIdPayment(idPayment)
      if(!purchase){
        return notFoundError()
      }
      const buyer = await buyerRepository.findBuyerById(purchase.buyer_id)
      if(!buyer){
        return notFoundError()
      }
      const numbers_reservations = await buyerRepository.findNumbersReservationByBuyerIdAndRaffleId(buyer.id, purchase.raffle_id)
      if(!numbers_reservations){
        return notFoundError()
      }
      const raffle = await rafflesRepository.findRaffle(numbers_reservations.raffle_id)
      if(!raffle){
        return notFoundError()
      }
      
      return {buyer, purchase, numbers_reservations, raffle}
  }
  catch(error){
      console.log(error.message)
      next(error)
  }
}

async function cancelPaymentTicket(id:string, next: NextFunction) {
  try{
    if(!id) throw notFoundError()
    const cancelSuccess = await webhookRepository.updateStatusPurchases(id)
    return cancelSuccess
  }
  catch(error){
    console.log(error.message)
    next(error)
  }
}

const buyerService = {
    createPaymentToTicket,
    findTickets,
    findByIdPayment,
    cancelPaymentTicket
}
export default buyerService;