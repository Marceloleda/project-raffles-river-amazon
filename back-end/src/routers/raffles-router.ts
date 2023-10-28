import { Router } from "express";
import { authenticateToken, validateBody } from '../middlewares';
import { raffleSchema } from '../schemas';
import { createRaffle, deleteRaffle, findRaffle} from "../controllers";


const rafflesRouter = Router();

rafflesRouter
.post('/',
authenticateToken, 
validateBody(raffleSchema), createRaffle)

rafflesRouter.get('/:id/:slug', findRaffle)

rafflesRouter.delete('/delete/:id', 
authenticateToken,
deleteRaffle)

export { rafflesRouter}
validateBody(raffleSchema)
