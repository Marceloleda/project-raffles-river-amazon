import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { findPayment_body, payment_body } from "../protocols";
import dayjs from "dayjs";
import { notFoundError, unauthorizedError } from "../errors";
import mercadoPagoService from "../services/mercado-pago-service";
import httpStatus, { OK } from "http-status";
import { v4 as uuidv4 } from 'uuid';
import buyerService from "@/services/buyer-service";
import { io } from "@/app";

let mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(process.env.TOKEN_MERCADOPAGO_PRODUCTION);
config();

async function paymentPix(res:Response, body:payment_body, userId: string, next: NextFunction) {
  if(!userId) throw unauthorizedError()
  const date = dayjs();
  const expireAt = date.add(15, 'minutes');

    const decimalPrice = body.value;
    const numberPrice = decimalPrice.toNumber();

    let payment_data = {
      transaction_amount: numberPrice,
      description: body.name_plan,
      payment_method_id: 'pix',
      date_of_expiration: expireAt,
      payer: {
        email: body.email,
        first_name: body.name_user,
        last_name: '',
        identification: {
            type: 'CPF',
            number: body.cpf
        }
      }
    };
    try{
      const payment = await mercadopago.payment.create(payment_data)
      if(payment){
        await mercadoPagoService.createPaymentPlan(body, payment.body, userId, next)

        console.log("payment created")
      }
      return payment.body;
    }
    catch(error) {
      console.log("failed payment creation")
      console.log(error.message)
      next(error)
    };
}

async function findPayment(req: Request, res:Response, next: NextFunction) {
    try{
      const {id} = req.params
      if(!id){
        throw notFoundError()
      }
      const payment = await mercadopago.payment.get(id);

      res.status(httpStatus.OK).send(payment.body)
    }
    catch(error) {
      console.log(error.message)
      next(error)
    };
}

async function cancelPayment(req: Request, res: Response, next: NextFunction) {
  try{
    const {id} = req.params;
    if(!id){
      return res.status(httpStatus.NOT_FOUND).send({"messsage":"Not found ID"})
    }
    const cancel = await mercadopago.payment.cancel(id)
    if(!cancel){
      return res.status(httpStatus.NOT_ACCEPTABLE).send()
    }
    const updateStatus = await buyerService.cancelPaymentTicket(id, next)
    if(!updateStatus){
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({"messsage":"don't updated status on db"})
    }
    res.status(httpStatus.OK).send({"message":"Cancel payment success!"})
  }
  catch(error){
    console.log(error.message)
    next(error)
  }
}



const mercadoPago = {
  paymentPix,
  findPayment,
  cancelPayment
}
export default mercadoPago