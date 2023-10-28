import { raffles, sellers } from "../node_modules/.prisma/client";
import Decimal from "decimal.js";

export type ApplicationError = {
    name: string;
    message: string;
};


export type GetUserOrFailResult = Pick<sellers, 'id' | 'email' | 'password_hash'>;
export type SignUp = Omit<sellers,  'created_at' | 'updated_at'>; 
export type createRaffle = Omit<raffles, 'updated_at'>

export type payment_body = {
    plan_id: number,
    name_plan: string,
    name_user:string,
    value: Decimal,
    email: string,
    cpf: string
}

export type webhook_notfication = {
    
    action: string,
    api_version: string
    data: { id: number },
    date_created: Date,
    id: number,
    live_mode: boolean,
    type: string,
    user_id: number
}
export type buyData ={
    name: string,
    email: string,
    phone_number: string,
    idRaffle: string,
    quantity: number,
    total: any
}