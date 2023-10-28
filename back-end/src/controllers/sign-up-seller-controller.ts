import { SignUp } from "../protocols";
import signUpService from "../services/sign-up-seller-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function createSignUpSeller(req: Request, res: Response, next: NextFunction){
    const data = req.body as SignUp
    try{
        await signUpService.signUpCreate(res, data);
        return res.sendStatus(httpStatus.CREATED);
    }catch(error){
        console.log(error.message)
        next(error)
    }
}