import Joi from 'joi';
import { SignUp } from '../protocols';
import { SignInParams } from '../services/authentication-service';
import { cpf } from 'cpf-cnpj-validator';
import { raffles } from '../../node_modules/.prisma/client';


export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password_hash: Joi.string().required(),
});

export const signUpSchema = Joi.object<SignUp>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password_hash: Joi.string()
    .min(8)
    .required(),
    phone_number: Joi.string().required(),
    cpf: Joi.string()
    .custom((value, helpers) => {
      if (!cpf.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
  });

export const raffleSchema = Joi.object<raffles>({
    title: Joi.string().required(),
    description: Joi.string().min(20).required(),
    ticket_price: Joi.number().positive().precision(2).required(),
    total_tickets: Joi.number().positive().required()
  });


  // password_hash: Joi.string()
  // .min(8)
  // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
  // .required()
  // .messages({
  //   'string.min': 'A senha deve ter no mínimo {#limit} caracteres',
  //   'string.pattern.base': 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial',
  //   'any.required': 'A senha é obrigatória'
  // })