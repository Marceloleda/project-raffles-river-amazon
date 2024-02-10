import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { connectDb, disconnectDB } from './config/database';
import { handleApplicationErrors } from './middlewares';
import { 
  authenticationRouter, 
  buyerRouter, 
  plansRouter, 
  rafflesRouter, 
  selllerRouter, 
  signUpRouter, 
  webhookRouter,
  whatsappBotRouter
} from './routers';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://rifasrioamazonas.com.br', 'https://www.rifasrioamazonas.com.br'], // Substitua pelo URL do seu frontend (Next.js)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
app
  .use(cors())
  .use(express.json())
  .use('/auth', authenticationRouter)
  .use('/sign-up', signUpRouter)
  .use('/raffle', rafflesRouter)
  .use('/plan', plansRouter)
  .use('/mercadopago', webhookRouter)
  .use('/seller', selllerRouter)
  .use('/buyer', buyerRouter)
  .use('/whatsapp-bot', whatsappBotRouter)
  .use(handleApplicationErrors);

// io.on('connection', (socket) => {
//   console.log('Novo cliente conectado');

//   socket.on('hello', (arg) => {
//     console.log(arg); // 'world'
//   });

//   socket.on('error', (err) => {
//     console.error('Erro no socket:', err);
//   });

//   // Evento personalizado para debug
//   socket.on('debug', (data) => {
//     console.log('Evento de debug:', data);
//   });
// });

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export { server, io }; // Exportando server e io para uso em outras partes do código
export default app;
