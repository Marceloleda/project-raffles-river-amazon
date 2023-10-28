import { sellers } from '../../../node_modules/.prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from '../../services/authentication-service/errors';
import { GetUserOrFailResult } from '../../protocols';
import { exclude } from '../../utils/prisma-utils';
import sellerRepository from '../../repositories/sellers-repository';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password_hash } = params;

  const seller = await getUserOrFail(email);

  await validatePasswordOrFail(password_hash, seller.password_hash);

  const token = await createToken(seller.id);

  return {
    seller: exclude(seller, 'password_hash'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const seller = await sellerRepository.findByEmail(email);
  if (!seller){
    throw invalidCredentialsError();
  } 
  return seller;
}

async function createToken(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token;
}

async function validatePasswordOrFail(password: string, password_hash: string) {
  const isPasswordValid = await bcrypt.compare(password, password_hash);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<sellers, 'email' | 'password_hash'>;

type SignInResult = {
  seller: Pick<sellers, 'id' | 'email'>;
  token: string;
};


const authenticationService = {
  signIn,
};

export default authenticationService;
export * from './errors';
