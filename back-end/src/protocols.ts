import { raffles, sellers } from "@prisma/client";
import Decimal from "decimal.js";

export type ApplicationError = {
    name: string;
    message: string;
};


export type GetUserOrFailResult = Pick<sellers, 'id' | 'email' | 'password_hash'>;
export type SignUp = Omit<sellers,  'created_at' | 'updated_at'>; 
export type createRaffle = Omit<raffles, 'updated_at'>

export type payment_body = {
    plan_id: string,
    name_plan: string,
    name_user:string,
    value: Decimal,
    email: string,
    cpf: string
}

export type findPayment_body = {
    payment_id: string
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
    hasWhatsapp: boolean,
    idRaffle: string,
    quantity: number,
    total: any
}

export type successPaymentType = {
    buyer: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        created_at: Date;
        hasWhatsapp: boolean;
    };
    purchase: {
        id: string;
        buyer_id: string;
        raffle_id: string;
        quantity_tickets: number;
        total_value: Decimal;
        purchase_date: string;
        date_of_expiration: string;
        payment_status: string;
        payment_id: string;
        };
    numbers_reservations: {
        id: string;
        buyer_id: string;
        purchases_id: string;
        raffle_id: string;
        ticket_numbers: string[];
        reservation_date: Date;
        };
    raffle: {
        id: string;
        seller_id: string;
        title: string;
        description: string;
        ticket_price: Decimal;
        total_tickets: number;
        start_date: Date;
        end_date: Date;
        created_at: Date;
        updated_at: Date;
        expire_at: string;
        avaliable_tickets: number;
    };
}