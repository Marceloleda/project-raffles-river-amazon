import { conflictError, notFoundError } from "../../errors"
import bcrypt from 'bcrypt';
import { SignUp } from "../../protocols"
import sellerRepository from "../../repositories/sellers-repository"
import { Response } from "express"
import planRepository from "../../repositories/plans-repository";


async function signUpCreate(res: Response, data:SignUp) {   

    const exist = await checkIfEmailOrCpfExists(data.email, data.cpf, data.phone_number);
    if(exist.conflict === true){
        throw conflictError(exist.message)
    }

    const hash = await hashPassword(data.password_hash);
    const plan_id_test = await planRepository.findPlanTest()
    const data_with_hash_and_planId = ({...data, password_hash: hash, plan_id: plan_id_test.id})

    const seller = await sellerRepository.createSignUp(data_with_hash_and_planId)

    return seller 
}
async function checkIfEmailOrCpfExists(email: string, cpf: string, phone: string) {
    const emailExist = await sellerRepository.findByEmail(email)
    const cpfExist = await sellerRepository.findByCPF(cpf)
    const phoneExist = await sellerRepository.findByPhone(phone)

    if (emailExist) {
        return {
            conflict: true,
            message: "Already have an account registered with this Email"
        };
    }
    if (cpfExist) {
        return {
            conflict: true,
            message: "Already have an account registered with this CPF"
        };
    }
    if (phoneExist) {
        return {
            conflict: true,
            message: "Already have an account registered with this Phone"
        };
    }

    return { conflict: false };
}
async function hashPassword(password?: string): Promise<string> {
    if (!password) {
      throw notFoundError();
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

const signUpService = {
    signUpCreate,
};
export default signUpService;