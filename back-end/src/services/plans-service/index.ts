import mercadoPago from "../../controllers/mercado-pago-controller";
import { conflictError, notFoundError, notModifiedError, unauthorizedError } from "../../errors";
import planRepository from "../../repositories/plans-repository";
import sellerRepository from "../../repositories/sellers-repository";
import { plans } from "@prisma/client";
import dayjs from "dayjs";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

async function searchPayment(res: Response, payment_id: string) {
    var mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken(process.env.TOKEN_MERCADOPAGO_PRODUCTION);
    const searchResult = await mercadopago.payment.get(payment_id);
    return searchResult.body
}

function isExpired(dateString: string) {
    const currentDate = dayjs();
    const expirationDate = dayjs(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    return expirationDate.isBefore(currentDate);
}

async function createPaymentToBasic(res: Response, userId: number, next: NextFunction) {
    let paymentFound = false;
    const user = await sellerRepository.findByUserId(userId)
    const planBasic = await planRepository.findPlanBasic()

    if(!userId) throw unauthorizedError()
    if(!user) throw notFoundError()
    if(user.plan_id === planBasic.id) throw notModifiedError()
    
    const body = {
        plan_id:planBasic.id,
        name_plan: planBasic.name,
        name_user:user.name,
        value: planBasic.price,
        email: user.email,
        cpf: user.cpf
    }
    const logPaymentUser = await sellerRepository.logsPayment(userId)

    try{
        for(const log of logPaymentUser){
            const dateString = log.date_of_expiration;  
            if(log.status_payment === "pending" && isExpired(dateString) === false && log.plan_id === planBasic.id) {
                paymentFound = true;
                const paymentPlan = await searchPayment(res, log.payment_id);
                return paymentPlan
            }
        }
        if (!paymentFound) {
            const payment = await mercadoPago.paymentPix(res, body, userId, next)
            return payment
        }
    }
    catch(error){
        console.log(error.message)
        next(error);
    }
}

async function createPaymentToPremium(res: Response, userId: number, next: NextFunction) {
    let paymentFound = false;
    const user = await sellerRepository.findByUserId(userId)
    const planPremium = await planRepository.findPlanPremium()
    if(!userId) throw unauthorizedError()
    if(!user) throw notFoundError()
    if(user.plan_id === planPremium.id) throw notModifiedError()


    const body = {
        plan_id:planPremium.id,
        name_plan: planPremium.name,
        name_user:user.name,
        value: planPremium.price,
        email: user.email,
        cpf: user.cpf
    }

    const logPaymentUser = await sellerRepository.logsPayment(userId)
    
    try{
        for(const log of logPaymentUser){
            const dateString = log.date_of_expiration;  
            if(log.status_payment === "pending" && isExpired(dateString) === false && log.plan_id === planPremium.id) {
                paymentFound = true;
                const paymentPlan = await searchPayment(res, log.payment_id);
                return paymentPlan
            }
        }
    
        if (!paymentFound){
            const payment = await mercadoPago.paymentPix(res, body, userId, next)
            return payment
        }
    }
    catch(error){
        console.log(error.message)
        next(error);
    }
}
async function createPaymentToMasterRaffle(res: Response, userId: number, next: NextFunction) {
    let paymentFound = false;
    const user = await sellerRepository.findByUserId(userId)
    const planMaster = await planRepository.findPlanMegaRifa()

    if(!userId) throw unauthorizedError()
    if(!user) throw notFoundError()
    if(user.plan_id === planMaster.id) throw notModifiedError()


    const body = {
        plan_id:planMaster.id,
        name_plan: planMaster.name,
        name_user:user.name,
        value: planMaster.price,
        email: user.email,
        cpf: user.cpf
    }

    const logPaymentUser = await sellerRepository.logsPayment(userId)

    try{
        for(const log of logPaymentUser){
            const dateString = log.date_of_expiration;  
            if(log.status_payment === "pending" && isExpired(dateString) === false && log.plan_id === planMaster.id) {
                paymentFound = true;
                const paymentPlan = await searchPayment(res, log.payment_id);
                return paymentPlan
            }
        }
        if (!paymentFound){
            const payment = await mercadoPago.paymentPix(res, body, userId, next)
            return payment
        }
    }
    catch(error){
        console.log(error.message)
        next(error);
    }
}
async function findAllPlans(): Promise<any> {
        const plans = await planRepository.findAllPlans()
        if(!plans) throw notFoundError()
        return plans
}
const planService = {
    createPaymentToBasic,
    createPaymentToPremium,
    createPaymentToMasterRaffle,
    findAllPlans
}
export default planService