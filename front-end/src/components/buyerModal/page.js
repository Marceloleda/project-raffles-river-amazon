'use client'

import { styled } from "styled-components"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buyTicket } from "../../services/api";

export function BasicModal() {
  let dataRaffle
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState()

  if (typeof window !== 'undefined') {
    const bodyString = localStorage.getItem("bodyRaffle");
    dataRaffle = JSON.parse(bodyString);
  }
  const router =useRouter()
  const [buyer, setBuyer] = useState({
    name: '',
    email: '',
    phone_number:''
})

function sendBuyTicket(event){
  event.preventDefault();
  const body = {...buyer, 
  idRaffle: dataRaffle.raffleId,
  quantity: dataRaffle.quantity,
  total: dataRaffle.total
  }
  buyTicket(body)
  setIsLoading(true)
  .then((res) => {
    const mercadoPago = res.data
    // router.push(`/payment-buyer/${mercadoPago.id}`)
    setIsLoading(false);
    router.push(`${mercadoPago?.point_of_interaction?.transaction_data?.ticket_url}`)
  })
  .catch(err => {console.log(err)});
  setIsLoading(false);

}
    return (
      <ModalContainer>
        <ContentWrapper>
          <ModalContent>
                <h1>Preencha seus dados</h1>

                <Forms>
                    <form onSubmit={sendBuyTicket}>
                        <Inserir id="name" placeholder="Nome completo" value={buyer.name} onChange={(e)=>
                        setBuyer({...buyer, name: e.target.value})
                        } required/>
                        <Inserir id="email" type="email" placeholder="Email" value={buyer.email} onChange={(e)=>
                        setBuyer({...buyer, email: e.target.value})
                        }required/>
                        <Inserir id="phone_number" type="phone" placeholder="celular" value={buyer.phone_number} onChange={(e)=>
                        setBuyer({...buyer, phone_number: e.target.value})
                        }required/>

                        <Botao type="submit" isLoading={isLoading}>{
                          isLoading? 
                          (<SpinnerContainer>
                            <StyledSpinner />
                          </SpinnerContainer>): "Continuar"
                        }</Botao>
                    </form>
                </Forms>
            <div>
                <ModalButton onClick={()=>{router.back()}}>Voltar</ModalButton>
            </div>
          </ModalContent>
        </ContentWrapper>
      </ModalContainer>
    );
}

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
  z-index: 10;
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

const ModalContent = styled.div`
  display:flex;
  justify-content: center;
  flex-direction:column;
  width:400px;
  background-color: #fff;
  border-radius: 0.375rem;
  padding: 1rem;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
  background-color: #3182ce;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #4299e1;
  }
`;

const Forms = styled.div`
    form{
            display:flex;
            flex-direction:column;
            justify-content: center;
            align-items: center;
        }
`
const Inserir = styled.input`
    width: 100%;
    height: 58px;
    margin-bottom: 16px;
    background: #FFFFFF;
    border: 1px solid #D5D5D5;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    &:first-child{
        margin-top: 25px;
    }
`;
const Botao = styled.button`
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 20px;
width: 100%;
height: 46px;
background: green;
border-radius: 5px;
border:none;

cursor: ${(prop)=>prop.isLoading === true? "": "pointer" };
font-family: 'Raleway';
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    color: #FFFFFF;
    &:hover {
      ${(prop)=>prop.isLoading === true? "": "background-color: #28e241;" }
    }
`;
