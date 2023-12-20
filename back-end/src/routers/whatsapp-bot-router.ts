import { checkPhone } from "../controllers/whatsapp-bot-controller";
import { Router } from "express";

const whatsappBotRouter = Router();

whatsappBotRouter
.get('/check-phone/:phone', checkPhone)



export { whatsappBotRouter}
