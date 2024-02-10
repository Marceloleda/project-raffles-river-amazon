import { prisma } from "../../config";
import { createRaffle } from "../../protocols";

async function createRaffles(data: createRaffle){
    return await prisma.raffles.create({
        data
    })
}

async function findSellerAndRafflesByUserId(id:string) {
    return await prisma.sellers.findUnique({
        where: {
            id
          },
          include: {
            raffles: true
          }
    })
}

async function findRaffle(id:string) {
    return await prisma.raffles.findUnique({
        where: {id}
    })
}
async function findMyRaffles(id:string) {
    return await prisma.raffles.findMany({
        where: {seller_id: id}
    })
}

async function updateTotalTickets(id:string, balance: number) {
    return await prisma.sellers.update({
        where: {id},
        data:{
            total_ticket_plan: balance
        }
    })
}
async function updateTicketsAvaliables(id:string, balance: number) {
    return await prisma.raffles.update({
        where: {id},
        data:{
            avaliable_tickets: balance
        }
    })
}
async function createShuffleNumbers(id: string, shuffledArray: any, userId: string){
    return await prisma.shuffle_numbers.create({
        data: {
            raffle_id: id,
            random_numbers: shuffledArray,
            seller_id: userId
        }
    })
}
async function deleteMyRaffle(id:string) {
    return await prisma.raffles.update({
        where: {id},
        data: {
            is_deleted: true
        }
    })
}

const rafflesRepository = {
    createRaffles,
    findSellerAndRafflesByUserId,
    findRaffle,
    updateTotalTickets,
    createShuffleNumbers,
    findMyRaffles,
    updateTicketsAvaliables,
    deleteMyRaffle

}
export default rafflesRepository;