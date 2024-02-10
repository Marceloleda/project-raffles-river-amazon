import { prisma } from '../../config';

async function findBuyerByEmail(email: string) {
    const buyer = await prisma.buyer.findFirst({
      where: {email}
    });
  
    return buyer;
}
async function findBuyerByPhone(phone: string) {
    const buyer = await prisma.buyer.findFirst({
      where: {phone}
    });
  
    return buyer;
}

async function findBuyerById(id: string) {
  const buyer = await prisma.buyer.findFirst({
    where: {id}
  });

  return buyer;
}

async function createBuyer(name: string, email: string, phone: string) {
    const buyer = await prisma.buyer.create({
      data: {
        full_name: name,
        email,
        phone
    }
    });
  
    return buyer;
}

async function findNumbersReservationByBuyerId(id: string) {
  const buyer = await prisma.numbers_reservations.findMany({
    where: {buyer_id: id}
  });

  return buyer;
}

async function findNumbersReservationByPurchaseId(id: string) {
  const buyer = await prisma.numbers_reservations.findFirst({
    where: {
      purchases_id: id
    }
  });

  return buyer;
}

async function findNumbersReservationByBuyerIdAndRaffleId(buyerId: string, raffleId: string) {
  const reservation = await prisma.numbers_reservations.findFirst({
    where: {
      buyer_id: buyerId,
      raffle_id: raffleId
    }
  });

  return reservation;
}

async function findPuchaseById(id: string) {
  const purchase = await prisma.purchases.findUnique({
    where: {
      id: id
    }
  });

  return purchase;
}

const buyerRepository = {
    findBuyerByEmail,
    findBuyerByPhone,
    findBuyerById,
    createBuyer,
    findNumbersReservationByBuyerId,
    findNumbersReservationByPurchaseId,
    findNumbersReservationByBuyerIdAndRaffleId,
    findPuchaseById
}
export default buyerRepository
