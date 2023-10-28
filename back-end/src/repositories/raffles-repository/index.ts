import { prisma } from "../../config";
import { createRaffle } from "../../protocols";

async function createRaffles(data: createRaffle){
    return await prisma.raffles.create({
        data
    })
}

async function findSellerAndRafflesByUserId(id:number) {
    return await prisma.sellers.findUnique({
        where: {
            id
          },
          include: {
            raffles: true
          }
    })
}

async function findRaffle(id:number) {
    return await prisma.raffles.findUnique({
        where: {id}
    })
}
async function findMyRaffles(id:number) {
    return await prisma.raffles.findMany({
        where: {seller_id: id}
    })
}

async function updateTotalTickets(id:number, balance: number) {
    return await prisma.sellers.update({
        where: {id},
        data:{
            total_ticket_plan: balance
        }
    })
}
async function updateTicketsAvaliables(id:number, balance: number) {
    return await prisma.raffles.update({
        where: {id},
        data:{
            avaliable_tickets: balance
        }
    })
}
async function createShuffleNumbers(id: number, shuffledArray: any, userId: number){
    return await prisma.shuffle_numbers.create({
        data: {
            raffle_id: id,
            random_numbers: shuffledArray,
            seller_id: userId
        }
    })
}
async function deleteMyRaffle(id:number) {
    return await prisma.raffles.delete({
        where: {id}
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