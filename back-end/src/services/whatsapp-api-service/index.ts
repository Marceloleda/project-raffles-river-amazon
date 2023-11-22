// import schedule from 'node-schedule';
import axios from "axios";

const token = process.env.AUTH_TOKEN_WHATSAPP
const api_whatsapp = process.env.API_URI_WHATSAPP
const key = process.env.INSTANCE_KEY
const headers = {
    Authorization: `Bearer ${token}`,
  };

// function scheduleMessage(dateNotification) {

//     console.log({ teste: dateNotification.toFormat('dd-MM-yyyy HH:mm') });
//     const dataHoraAgendamentoJS = dateNotification.toJSDate();
  
//     schedule.scheduleJob(dataHoraAgendamentoJS, async () => {
//       try {
//         const response = await axios.post(
//           `${api_whatsapp}/message/text?key=${key}`,
//           {
//             id: '559295074770',
//             message: 'Você tem um evento agendado para amanhã.',
//           },
//           { headers }
//         );
  
//         console.log('Mensagem enviada com sucesso:', response.data);
//       } catch (error) {
//         console.error('Erro ao enviar mensagem:', error.message);
//       }
//     });
// }

async function sendMessage(name: string, phone: string | null, firstNumbers: string[]) {
    try {
        const numberPhone = await formatNumberWhatsapp({ numero: phone });
        let phoneWhats;
        
        if (numberPhone && numberPhone.length >= 11) {
          const ddd = numberPhone.substring(2, 4);
          if (!['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'].includes(ddd)) {
            phoneWhats = numberPhone.replace(/(\d{4})9/, '$1');
          } else {
            phoneWhats = numberPhone; // Mantém o número se o DDD estiver na lista especificada.
          }
        } else {
          phoneWhats = numberPhone; // Mantém o número se tiver menos de 11 dígitos.
        }

const message = `
Olá, *${name}*! 🤩\n  
Você já está concorrendo! 🎉\n

${firstNumbers.length > 1? `Seus números da sorte são: ${firstNumbers} `: `Seu número é : ${firstNumbers}`} \n
        
        
Aproveite este momento especial e junte-se a nós para uma jornada única!\n

*1º* - Acesse o link abaixo para entrar no grupo do WhatsApp\n
*2º* - Leia as regras do grupo\n
*3º* - Aguarde o sorteio\n

link do grupo whatsapp: https://chat.whatsapp.com/... \n
        
*Vejo você lá!* 🥳
        
_Serviço automático, não responda_`;
  
        await axios.post(
        `${api_whatsapp}/message/text?key=${key}`,
        {
            id: phoneWhats,
            message: message,
        },
        { headers }
        );
        // console.log('Mensagem enviada com sucesso:', response.data);

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
    }
}

async function checkPhone(phone: string | null) {
    try {
      const number = await formatNumberWhatsapp({ numero: phone });
  
      const response = await axios.get(
        `${api_whatsapp}/misc/onwhatsapp?key=${key}&id=${number}`,
        { headers }
      );
      // console.log('Número existe:', response?.data?.data);
      return response?.data?.data;
    } catch (error) {
      console.error('Número não existe:', error?.response?.data);
    }
  }
  
  async function formatNumberWhatsapp({ numero }: { numero: string | null }) {
    if (numero) {
      const clearNumber = numero.replace(/\D/g, '');
  
      // Adicionar "55" no início
      const numberWhatsapp = `55${clearNumber}`;
  
      return numberWhatsapp;
    }
    return null;
  }

const whatsappApi = {
    // scheduleMessage,
    sendMessage,
    checkPhone
}

export default whatsappApi