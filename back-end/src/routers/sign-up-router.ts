import { Router } from "express";
import { validateBody } from '../middlewares';
import { signUpSchema } from '../schemas';
import { createSignUpSeller } from "../controllers";


const signUpRouter = Router();

signUpRouter.post('/', validateBody(signUpSchema), createSignUpSeller)

export { signUpRouter}
validateBody(signUpSchema)
