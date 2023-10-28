import { AuthenticatedRequest } from "../middlewares";
import planService from "../services/plans-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function basicPlan(req: AuthenticatedRequest, res: Response, next:NextFunction){
    const {userId} = req
    console.log("basic plan")
    try{
        const paymentCreated = await planService.createPaymentToBasic(res, userId, next);
        return res.status(httpStatus.OK).send(paymentCreated);
    }catch(error){
        console.log(error.message)
        next(error)
    }
}
export async function premiumPlan(req: AuthenticatedRequest, res: Response, next:NextFunction){
    const {userId} = req
    console.log("premium plan")

    try{
        const paymentCreated = await planService.createPaymentToPremium(res, userId, next);
        return res.status(httpStatus.OK).send(paymentCreated);
    }catch(error){
        console.log(error.message)
        next(error)
    }
}

export async function masterRafflePlan(req: AuthenticatedRequest, res: Response, next:NextFunction){
    const {userId} = req
    console.log("master raffle plan")

    try{
        const paymentCreated = await planService.createPaymentToMasterRaffle(res, userId, next);
        return res.status(httpStatus.OK).send(paymentCreated);
    }catch(error){
        console.log(error.message)
        next(error)
    }
}

export async function getAllPlans(req: Request,res: Response, next: NextFunction): Promise<any> {
    try{
        const allPlans = await planService.findAllPlans()
        return res.status(httpStatus.OK).send(allPlans)
    }catch(error){
        console.log(error.message)
        next(error)
    }

}
    