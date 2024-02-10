'use client'

import { IMaskInput } from 'react-imask';
import { styled } from "styled-components"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buyTicket, checkWhatsappPhone } from "../../services/api";
import Logopix from "../../assets/images/pixLogo.png"
import LogoWhats from "../../assets/images/whats184.png"
import Image from "next/image";
import LogoMP from "../../assets/images/mercado-pago.png"
import { Alert, AlertTitle, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import DataPaymentBuyer from '../../app/payment-buyer/page';
import Swal from 'sweetalert2';


export function BasicModal({onSetStateModal}) {
  let dataRaffle
  const [buyer, setBuyer] = useState({
    name: '',
    email: '',
    phone_number:'',
    hasWhatsapp: false,
    adult: false

})
  const [isLoading, setIsloading] = useState(false);
  const [whatsappExist, setWhatsappExist] = useState(true);
  const [mercadoPagoData, setMercadoPagoData] = useState(null)
  
  if (typeof window !== 'undefined') {
    const bodyString = localStorage.getItem("bodyRaffle");
    dataRaffle = JSON.parse(bodyString);
  }
  const router =useRouter()

function sendBuyTicket(event){
  event.preventDefault();
  setIsloading(true);

  const body = {...buyer, 
  idRaffle: dataRaffle.raffleId,
  quantity: dataRaffle.quantity,
  total: dataRaffle.total
  }


  if (body.hasWhatsapp === true) {
    checkWhatsappPhone(body.phone_number)
      .then((res) => {
        if (res.data === true) {
          // O número de WhatsApp existe, então podemos prosseguir com a compra
          buyTicket(body)
            .then((res) => {
              const mercadoPago = res.data;
              setIsloading(false);
              // window.open(
              //   `${mercadoPago?.point_of_interaction?.transaction_data?.ticket_url}`,
              //   '_blank'
              // );
              setMercadoPagoData(res.data)
              // router.push(`/payment-buyer/${mercadoPago.id}`)
            })
            .catch((err) => {
              console.log(err.message);
              setIsloading(false);
            });
        } else {
          // O número de WhatsApp não existe, você pode tratar isso aqui se necessário
          setWhatsappExist(res.data);
          setIsloading(false);
          // console.log("Número de WhatsApp não existe");
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsloading(false);
      });
  } else {
    // Se o usuário não optou por receber via WhatsApp, prossiga com a compra
    buyTicket(body)
      .then((res) => {
        const mercadoPago = res.data;
        setIsloading(false);
        setMercadoPagoData(res.data)
        // window.open(
        //   `${mercadoPago?.point_of_interaction?.transaction_data?.ticket_url}`,
        //   '_blank'
        // );
        // router.push(`/payment-buyer/${mercadoPago.id}`)
      })
      .catch((err) => {
        console.log(err.message);
        setIsloading(false);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Algo deu errado, volte para a campanha e tente novamente!",
        });
      });
  }
}

  return (
      <ModalContainer>
        <ContentWrapper>
         {mercadoPagoData !== null?
         <DataPaymentBuyer onDataMecadopago={mercadoPagoData} setSchrollModel={onSetStateModal}/>
         :
          <ModalContent>
            <h1>Preencha seus dados</h1>
            <Forms>
              <form onSubmit={sendBuyTicket}>
                <Inserir 
                  id="name" 
                  $isloading={isLoading}
                  placeholder="Nome completo" 
                  value={buyer.name} onChange={(e)=>
                  setBuyer({...buyer, name: e.target.value})
                  } required/>
                <Inserir 
                  id="email" 
                  $isloading={isLoading}
                  type="email" 
                  placeholder="Email" 
                  value={buyer.email} onChange={(e)=>
                  setBuyer({...buyer, email: e.target.value})
                  }required
                />
                <Inserir
                  id="phone"
                  $isloading={isLoading}
                  placeholder="(99) 99999-9999"
                  mask="(#0) 00000-0000"
                  definitions={{
                    '#': /[1-9]/,
                  }}
                  value={buyer.phone_number}
                  onChange={(e) => setBuyer({ ...buyer, phone_number: e.target.value })}
                  onAccept={(value) => setBuyer({ ...buyer, phone_number: value })}
                  required
                />

                {isLoading === true? 
                  <FormControlLabel
                    label="Receber números da sorte no WhatsApp?"
                    disabled
                    control={
                      <Checkbox checked={buyer.hasWhatsapp} onChange={(e)=>
                        setBuyer({...buyer, hasWhatsapp: e.target.checked})
                      } name="whatsapp" />
                    }
                  />
                  : 
                  <FormControlLabel
                  label="Receber números da sorte no WhatsApp?"
                  control={
                    <Checkbox checked={buyer.hasWhatsapp} onChange={(e)=>
                      setBuyer({...buyer, hasWhatsapp: e.target.checked})
                    } name="whatsapp" />
                  }
                  />
                  }
                  {whatsappExist? 
                  <FormHelperText>É necessário que o número tenha WhatsApp</FormHelperText>
                  :
                  <FormHelperText style={{color: "red", fontSize: '15px'}}>Adicione um número válido, que tenha WhatsApp</FormHelperText>
                  }
                    <Popup>
                      <Alert severity="info">
                        <h3>Seus dados serão salvos para futuras compras.</h3>
                      </Alert>
                    </Popup>

                  <DadosPagamento>
                    <h1>Detalhes da compra:</h1>
                    <div>
                      <Dados><h2>Rifa: </h2> <p>{dataRaffle.name}</p></Dados>
                      <Dados><h2>Quantidade:</h2> <p>{dataRaffle.quantity}</p></Dados>
                      <Dados><h2>Total:</h2><p>R$ {dataRaffle.total}</p></Dados>
                    </div>
                    
                    <h1>Formas de pagamento:</h1>
                    <Image
                      src={Logopix} 
                      alt="pix"
                      // width={210} 
                      height={55} 
                      style={{ marginBottom: '25px' }}
                    />
                    <Image
                      src={LogoMP} 
                      alt="pix"
                      // width={500} 
                      height={40} 
                      style={{ marginBottom: '35px', marginLeft: '15px' }}
                    />

                    <Popup>
                      <Alert severity="info">
                        <AlertTitle>Informação</AlertTitle>                            
                        <h3>No momento estamos aceitando somente pagamentos via Pix. <br/> <br/>Agradeço a compreensão.</h3>
                      </Alert>
                    </Popup>
                    {buyer.hasWhatsapp && buyer.hasWhatsapp === true?
                      <Popup>
                        <Alert severity="warning">
                          <AlertTitle>Aviso</AlertTitle>
                          <Image
                              src={LogoWhats} 
                              alt="whatsapp"
                              width={35} 
                              height={35} 
                            />
                          <h3>Após o pagamento, você receberá uma menssagem via WhatsApp com os números da sorte e também poderá consultar dentro do site.</h3>
                        </Alert>
                      </Popup>
                      : <></>
                    }
                    {whatsappExist?
                    ""
                    : 
                    <Alert severity="error">Este número não tem WhatsApp!</Alert>
                    }
                  </DadosPagamento>
                  {isLoading === true? 
                  <StyledFormControlLabel
                    label="Declaro ser maior de 18 anos e estar ciente de que menores não podem ganhar o prêmio."
                    disabled
                    control={
                      <Checkbox checked={buyer.adult} onChange={(e)=>
                        setBuyer({...buyer, adult: e.target.checked})
                      } name="maior idade" />
                    }
                  />
                  : 
                  <StyledFormControlLabel
                  label="Declaro ser maior de 18 anos e estar ciente de que menores não podem ganhar o prêmio."
                  control={
                    <Checkbox checked={buyer.adult} onChange={(e)=>
                      setBuyer({...buyer, adult: e.target.checked})
                    } name="maior idade" />
                  }
                  required
                  />
                  }

                  <Botao type="submit" $isloading={isLoading} disabled={isLoading}>{
                    isLoading? 
                    (<SpinnerContainer>
                      <StyledSpinner />
                    </SpinnerContainer>): "Finalizar compra"
                  }</Botao>
              </form> 
            </Forms>
          <div>
              <ModalButton 
              onClick={()=>{
                onSetStateModal(false)
                router.back()
              }} 
              $isloading={isLoading} 
              disabled={isLoading} 
              >
                Voltar
              </ModalButton>
          </div>
        </ModalContent>}
      </ContentWrapper>
    </ModalContainer>
  );
}
const StyledFormControlLabel = styled(FormControlLabel)`
  font-size: 5px;
`;
const SpinnerContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
`;

const Popup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 100%;
  // background: #fff282;
  // height: 110px;
  // box-sizing: border-box;
  // padding: 10px;
  // border-radius: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
  // font-family: 'Montserrat', sans-serif;
  // font-size: 16px;


  p{
    font-size: 10px;
    margin-bottom: 16px;
  }

`;

const Dados = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  &:last-child{
    margin-bottom: 40px;
  }
`;

const StyledSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid purple;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const ModalContainer = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0;
  overflow-y: auto;
`;


const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 4rem;
  padding-bottom: 20px;
  text-align: center;
`;
const DadosPagamento = styled.div`
  // display: flex;
  // align-items: flex-end;
  // justify-content: left;
  width: 100%;

  // background-color: grey;
  padding-top: 1.5rem;
  padding-bottom: 20px;
  text-align: left;
  h1{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 40px;
    }
  h2{
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  p{
    font-size: 18px;
    margin-bottom: 16px;
  }
`;


const ModalContent = styled.div`
  display:flex;
  justify-content: center;
  flex-direction:column;
  width:370px;
  background-color: #fff;
  border-radius: 0.375rem;
  padding: 1rem;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  h1{
    font-size: 24px;
    font-weight: bold;
    }
`;

const ModalButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 0.375rem;
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: ${(props) => (props.$isloading ? '#ccc' : '#3182ce')};
  transition: background-color 0.2s;
  cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'pointer')};

  &:hover {
    ${(props) => (props.$isloading === true ? '' : 'background-color: #4299e1;')}
  }
`;

const Forms = styled.div`
    form{
            display:flex;
            flex-direction:column;
            justify-content: center;
            align-items: center;
            
        }
`;
const Inserir = styled(IMaskInput)`
width: 100%;
height: 58px;
font-size: 18px;
margin-bottom: 16px;
background-color: ${(props) => (props.$isloading ? '#F5F5F5' : '#FFFFFF')};
border: 1px solid #D5D5D5;
border-radius: 20px;
padding: 10px;
box-sizing: border-box;
pointer-events: ${(props) => (props.$isloading ? 'none' : 'auto')};
cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'text')};
opacity: ${(props) => (props.$isloading ? '0.7' : '1')};  

&:first-child {
    margin-top: 25px;
}

`;
const Botao = styled.button`
display: flex;
justify-content: center;
align-items: center;
margin-top: 15px;
margin-bottom: 20px;
width: 100%;
height: 46px;
background: ${(props) => (props.$isloading ? '#999999' : '#28e241')};
border-radius: 20px;
border: none;

cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'pointer')};
font-family: 'Raleway';
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    color: #FFFFFF;
    &:hover {
      ${(props) => (props.$isloading === true ? '' : 'background-color: #25c63b;')}
    }
`;
