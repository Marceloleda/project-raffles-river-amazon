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
  const buyer = await prisma.numbers_reservations.findFirst({
    where: {buyer_id: id}
  });

  return buyer;
}

const buyerRepository = {
    findBuyerByEmail,
    findBuyerByPhone,
    findBuyerById,
    createBuyer,
    findNumbersReservationByBuyerId
}
export default buyerRepository
