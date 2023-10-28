import { notFoundError, unauthorizedError } from "../../errors"
import sellerRepository from "../../repositories/sellers-repository"

async function findSellerData(userId: number): Promise<any> {
        const seller = await sellerRepository.findByUserId(userId)
        if(!seller) throw unauthorizedError()
        if(!seller) throw notFoundError()

        return seller
}
const sellerService = {
    findSellerData
}
export default sellerService