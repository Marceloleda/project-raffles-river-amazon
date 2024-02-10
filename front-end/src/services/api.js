'use client'
import axios from "axios";

//DEV
// const URL = "http://localhost:5000";
let TOKEN;

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const URLWHATSAPP = process.env.NEXT_PUBLIC_API_WHATSAPP_URL || "http://www.rifasrioamazonas.com.br/whatsapp-bot";

export const api = axios.create({ baseURL: URL });

if (typeof window !== 'undefined') {
  TOKEN = localStorage.getItem('token');
}
api.defaults.headers["Authorization"] = `Bearer ${TOKEN}`;


export function signUpSend(body) {
  return api.post("/sign-up", body);
}

export function signIn(body) {
  return api.post("/auth/sign-in", body);
}

export function createPaymentToPlan(typePlan) {
  return api.post(`/plan/${typePlan}`);
}

export function findPlans(){
  return api.get("/plan/all");
}

export function buyTicket(body){
  return api.post("/buyer/payment", body)
}

export function findUser(){
  return api.get("/seller/search")
}

export function createRaffle(body){
  return api.post("/raffle", body)
}

export function findCampaigns(){
  return api.get("/seller/campaigns")
}

export function findRaffle(raffleId, slug){
  return api.get(`/raffle/${raffleId}/${slug}`)
}

export function findTicket(email, phone){
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  if (phone) params.append('phone', phone);

  const queryString = params.toString();

  return api.get(`/buyer/find-tickets?${queryString}`);
}

export function findBuyerByIdSuccessPayment(idPayment){
  return api.get(`/buyer/payment-success/${idPayment}`)
}

export function deleteOneRaffle(id){
  return api.put(`/raffle/delete/${id}`)
}

export function checkWhatsappPhone(phone){
  return api.get(`/whatsapp-bot/check-phone/${phone}`)
}

export function findPaymentRaffle(id){
  return api.get(`/buyer/find-payment-raffle/${id}`)
}

export function cancelPayment(id){
  return api.put(`/buyer/cancel-payment/${id}`)
}