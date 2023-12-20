import whatsappApi from "../services/whatsapp-api-service";
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status";

export async function checkPhone(req:Request, res: Response, next: NextFunction){
    const {phone} = req.params
    try{
        const numberExist = await whatsappApi.checkPhone(phone)
        return res.status(httpStatus.OK).send(numberExist);
    }
    catch(error){
        console.log(error.message)
        next(error)
    }
}