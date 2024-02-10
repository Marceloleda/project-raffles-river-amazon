import { Router } from "express";
import { buyTicket, findBuyerByIdPaymentSuccess, findTicket } from "../controllers/buyer-controller";
import mercadoPago from "../controllers/mercado-pago-controller";


const buyerRouter = Router();

buyerRouter
.post('/payment', buyTicket)
.get('/find-tickets', findTicket)
.get('/find-payment-raffle/:id', mercadoPago.findPayment)
.get('/payment-success/:idPayment', findBuyerByIdPaymentSuccess)
.put('/cancel-payment/:id', mercadoPago.cancelPayment)


export { buyerRouter}
