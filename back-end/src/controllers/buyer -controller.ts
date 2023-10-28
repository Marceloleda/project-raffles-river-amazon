import { buyData } from "../protocols";
import buyerService from "../services/buyer-service";
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status";

export async function buyTicket(req:Request, res: Response, next: NextFunction){
    const body: buyData = req.body
    try{
        const paymentCreated = await buyerService.createPaymentToTicket(body, next);
        return res.status(httpStatus.OK).send(paymentCreated);
    }
    catch(error){
        console.log(error.message)
        next(error)
    }
}