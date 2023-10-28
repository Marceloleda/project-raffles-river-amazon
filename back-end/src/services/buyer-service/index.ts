import { notFoundError, unauthorizedError } from "../../errors";
import { buyData } from "../../protocols";
import buyerRepository from "../../repositories/buyer-repository";
import rafflesRepository from "../../repositories/raffles-repository";
import dayjs from "dayjs";
import mercadoPagoService from "../mercado-pago-service";
import { NextFunction } from "express";
import mercadoPagoRepository from "../../repositories/payments-plan-repository";

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
    
    const IdRaffle = parseInt(idRaffle)
    const raffle = await rafflesRepository.findRaffle(IdRaffle)
    const date = dayjs();
    const expireAt = date.add(10, 'minutes');

    var mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken(process.env.TOKEN_MERCADOPAGO_PRODUCTION);
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
      const payment = await mercadopago.payment.create(payment_data)
      if(payment){
      if (!buyer.id) throw unauthorizedError();

      if (!idRaffle || !quantity || !total) throw notFoundError();
      await mercadoPagoRepository.createBuyerPayment(buyer.id, IdRaffle, quantity, total, payment.body)

        console.log("buyer payment created")
      }
      return payment.body;
    }
    catch(error) {
      console.log("failed buyer payment creation")
      console.log(error.message)
      next(error)
    };
}

const buyerService = {
    createPaymentToTicket
}
export default buyerService;