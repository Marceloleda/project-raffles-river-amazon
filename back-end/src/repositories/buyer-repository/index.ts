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
const buyerRepository = {
    findBuyerByEmail,
    findBuyerByPhone,
    createBuyer
}
export default buyerRepository
