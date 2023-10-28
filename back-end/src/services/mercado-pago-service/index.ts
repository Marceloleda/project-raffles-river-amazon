import { notFoundError, unauthorizedError } from "../../errors";
import { payment_body } from "../../protocols";
import mercadoPagoRepository from "../../repositories/payments-plan-repository";
import { config } from "dotenv";
import { NextFunction} from "express";

config();

async function createPaymentPlan( body: payment_body, payment: any, userId: number, next: NextFunction) {
  try {
    if (!userId) throw unauthorizedError();

    if (!payment) throw notFoundError();
    const createDataPaymentPlan = await mercadoPagoRepository.createPlanPayment(body.plan_id, payment, userId)

    if (createDataPaymentPlan) {
    
      return createDataPaymentPlan
    }

  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

const mercadoPagoService = {
    createPaymentPlan
}

export default mercadoPagoService