import { Router } from "express";
import { authenticateToken } from '../middlewares';
import { searchCampaigns, searchSellerData } from "../controllers";


const selllerRouter = Router();

selllerRouter.all('/*', authenticateToken)
.get('/search', searchSellerData)

selllerRouter.all('/*', authenticateToken)
.get('/campaigns', searchCampaigns)





export { selllerRouter}