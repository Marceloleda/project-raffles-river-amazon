import { prisma } from "../../config";
import { SignUp } from "../../protocols";

async function findByEmail(email: string){
    return await prisma.sellers.findUnique({
        where:{email}
    })
}
async function findByCPF(cpf: string){
    return await prisma.sellers.findUnique({
        where:{cpf}
    })
}
async function findByPhone(phone: string){
    return await prisma.sellers.findUnique({
        where:{phone_number: phone}
    })
}

async function findByUserId(id: number){
    return await prisma.sellers.findUnique({
        where: {id},
        include: {
            plans: true,
        },
    })
}

async function createSignUp(data: SignUp){
    return await prisma.sellers.create({
        data,
    })
}
async function updatePlan(planUpdate:any, id: number) {
    return await prisma.sellers.update({
        where:{id},
        data: planUpdate
    })
}
async function logsPayment( id: number) {
    return await prisma.payments_plan.findMany({
        where:{seller_id: id}
    })
}

const sellerRepository = {
    findByEmail,
    findByUserId,
    createSignUp,
    findByCPF,
    findByPhone,
    updatePlan,
    logsPayment
}

export default sellerRepository;