import authenticationService, { SignInParams } from "../services/authentication-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function postSignIn(req: Request, res: Response, next: NextFunction){
    const { email, password_hash } = req.body as SignInParams;
    try{
        const result = await authenticationService.signIn({email, password_hash });
        return res.status(httpStatus.OK).send({Token :result.token});

    }catch(error){
        console.log(error)
        next(error)
    }
}