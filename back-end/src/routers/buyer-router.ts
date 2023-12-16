import { Router } from "express";
// import { authenticateToken } from '@/middlewares';
import { buyTicket } from "../controllers/buyer -controller";


const buyerRouter = Router();

buyerRouter
.post('/payment', buyTicket)



export { buyerRouter}
