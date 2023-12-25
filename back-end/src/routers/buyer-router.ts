import { Router } from "express";
// import { authenticateToken } from '@/middlewares';
import { buyTicket, findTicket } from "../controllers/buyer -controller";


const buyerRouter = Router();

buyerRouter
.post('/payment', buyTicket)
.get('/find-tickets/:email/:phone', findTicket)


export { buyerRouter}
