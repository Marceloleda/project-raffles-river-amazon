'use client'
import { useState } from "react";
import styled from "styled-components";
import { createRaffle } from "../../services/api";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";


export default function CreateCampaign() {
  const router = useRouter()
  const [passwordError, setPasswordError] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: "",
    description: "",
    ticket_price:"",
    total_tickets: "",
  });
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if(campaignData.description?.length < 20) setPasswordError(true)
    else{
      const totalTicketsNumber = parseInt(campaignData.total_tickets, 10);
      createRaffle({...campaignData, total_tickets: totalTicketsNumber})
        .then((res) => {
          Swal.fire('Cadastrado com sucesso!', '', 'success');
          router.push("/seller")
        })
        .catch((err) => {
          if (err.message === "Request failed with status code 403") {
            Swal.fire({
              icon: 'error',
              title: 'Plano insuficiente',
              text: 'Para realizar esta ação é necessário realizar um upgrade de plano.',
              showCancelButton: true,
              confirmButtonColor: '#b972e0',
              cancelButtonColor: 'red',
              confirmButtonText: 'Upgrade de plano',
              cancelButtonText: 'Cancelar',
            }).then((result) => {
              if (result.isConfirmed) router.push('/')
            });
          }
        });
    }
  };
  function formatDecimal(value) {
    let sanitized = value.replace(/[^0-9]/g, '');
    let numericValue = Number(sanitized);
  
    if (!isNaN(numericValue)) {
      let formattedValue = (numericValue / 100).toFixed(2);
      setCampaignData({ ...campaignData, ticket_price: formattedValue });
    }
  }
  
  return (
    <>
      <Conteiner>
        <h4>Crie sua campanha</h4>

        <Forms>
          <form onSubmit={handleFormSubmit}>
          <Label htmlFor="title">Título</Label>
            <Inserir
              id="title"
              placeholder="ex: Uma máquina de lavar"
              value={campaignData.title}
              onChange={(e) =>
                setCampaignData({ ...campaignData, title: e.target.value })
              }
              required
            />
            <Label htmlFor="description">Descrição</Label>
            <Inserir
              id="description"
              type="text"
              placeholder="ex: Em prol a formatura do..."
              value={campaignData.description}
              onChange={(e) =>
                setCampaignData({ ...campaignData, description: e.target.value })
              }
            />
            <Label htmlFor="ticket_price">Valor de cota</Label>
            <Inserir
              id="ticket_price"
              type="text"
              placeholder="R$ 1.99"
              value={campaignData.ticket_price}
              onChange={(e) => {
                setCampaignData({ ...campaignData, ticket_price: e.target.value });
                formatDecimal(e.target.value);
              }}
              required

            />
            <Label htmlFor="total_tickets">Quantidade de cotas</Label>
            <Inserir
              id="total_tickets"
              type="number"
              placeholder="100"
              value={campaignData.total_tickets}
              onChange={(e) =>
                setCampaignData({ ...campaignData, total_tickets: e.target.value })
              }
              required
            />
            {/* <h2>Data do sorteio</h2>
            <Inserir
              id="end_date"
              type="date"
              placeholder="Data do sorteio (caso queira colocar)"
              value={campaignData.end_date}
              onChange={(e) =>
                setCampaignData({ ...campaignData, end_date: e.target.value })
              }
            /> */}
            {passwordError && (
              <ErrorMessage>
                {campaignData.description?.length < 20
                ? "A descrição deve ter pelo menos 20 caracteres."
                : ""}
              </ErrorMessage>
            )}
            <Botao type="submit">Criar campanha</Botao>
          </form>
        </Forms>
      </Conteiner>
    </>
  );
}


const Conteiner = styled.div`
font-family: 'Raleway';
    display:flex;
    align-items: center;
    flex-direction: column;
    h1{
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 32px;
        color:black;
    }
`;
const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
`;
const Label = styled.label`
  font-family: 'Raleway';
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  margin-bottom: 5px;
  text-align: left;
  width: 100%;
`;

const Forms = styled.div`
    form{
            display:flex;
            flex-direction:column;
            justify-content: center;
            align-items: center;
        }
`;
const Inserir = styled.input`
    width: 326px;
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
width: 326px;
height: 46px;
background: green;
border-radius: 5px;
border:none;
cursor: pointer;
font-family: 'Raleway';
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    color: #FFFFFF;
`;
const Entrar = styled.div`
    margin-top: 35px;
    h2{
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 700;
    }
`;