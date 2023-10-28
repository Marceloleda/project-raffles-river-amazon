import { AuthenticatedRequest } from "../middlewares";
import { createRaffle } from "../protocols";
import raffleService from "../services/raffles-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function createRaffle(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const data = req.body as createRaffle
    const {userId} = req
    try{
        await raffleService.raffleCreate(res, data, userId);
        return res.sendStatus(httpStatus.CREATED);
    }catch(error){
        next(error)
    }
}

export async function findRaffle(req: Request, res: Response, next: NextFunction){
    const {id, slug} = req.params
    const idRaffle = parseInt(id)
    try{
        const raffle = await raffleService.findUniqueRaffle(idRaffle, slug);
        return res.status(httpStatus.OK).send(raffle);
    }catch(error){
        next(error)
    }
}

export async function deleteRaffle(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const {id} = req.params
    const {userId} = req
    try{
         await raffleService.deleteRaffles(userId, id);
        return res.sendStatus(httpStatus.OK);
    }catch(error){
        next(error)
    }
}

