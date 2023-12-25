import { notFoundError, unauthorizedError } from "../../errors";
import { buyData } from "../../protocols";
import buyerRepository from "../../repositories/buyer-repository";
import rafflesRepository from "../../repositories/raffles-repository";
import dayjs from "dayjs";
import { NextFunction } from "express";
import mercadoPagoRepository from "../../repositories/payments-plan-repository";
var mercadopago = require('mercadopago');
mercadopago.configurations?.setAccessToken(process.env.TOKEN_MERCADOPAGO_PRODUCTION);

async function createPaymentToTicket(body: buyData, next: NextFunction) {
  const {idRaffle, name, email, phone_number, total, quantity} = body
    if(!body) throw notFoundError()
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
    
    const raffle = await rafflesRepository.findRaffle(idRaffle)
    const date = dayjs();
    const expireAt = date.add(15, 'minutes');

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
      console.log(error.message)
      return next(error)
    };
}

async function findTickets(email:string, phone: string, next: NextFunction) {
  try{
    const emailBuyer = await buyerRepository.findBuyerByEmail(email)
    if(!emailBuyer) return notFoundError();

    const phoneBuyer = await buyerRepository.findBuyerByEmail(phone)
    if(!phoneBuyer) return notFoundError();

    if(emailBuyer.id === phoneBuyer.id){
      const numbers = await buyerRepository.findNumbersReservationByBuyerId(emailBuyer.id)
      return numbers
    }
    if(emailBuyer.id !== phoneBuyer.id){
      const numbersEmail = await buyerRepository.findNumbersReservationByBuyerId(emailBuyer.id)
      const numbersPhone = await buyerRepository.findNumbersReservationByBuyerId(phoneBuyer.id)

      return {numbersEmail, numbersPhone}
    }
  }
  catch(error){
    return next(error)
  }
}

const buyerService = {
    createPaymentToTicket,
    findTickets
}
export default buyerService;