import { Router } from "express";
import { authenticateToken } from '../middlewares';
import { basicPlan, getAllPlans, masterRafflePlan, premiumPlan } from "../controllers";


const plansRouter = Router();

plansRouter
.post('/basic', authenticateToken, basicPlan)

plansRouter
.post('/premium', authenticateToken, premiumPlan)

plansRouter
.post('/master', authenticateToken, masterRafflePlan)

plansRouter.get('/all', getAllPlans)


export { plansRouter}
