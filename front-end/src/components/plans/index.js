'use client'

import { findPlans, findUser } from "../../services/api";
import CreatePayments from "../../services/paymentPlan";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from 'next/navigation';

export default function Plans(){
  const router = useRouter();
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({})
  const [token, setToken] = useState(null);

  
  const handlePurchaseButtonClick = (plan) => {
    CreatePayments(plan.name, router);
  };
  
  
  useEffect(()=>{
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if(storedToken){
      findUser()
      .then((res)=>{
          setUser(res.data)
          console.log(res.data)
      })
      .catch((err=>{
          console.log(err.message)
      }))
    }

    findPlans()
      .then((response)=>{
        setPlans(response.data)
        setIsLoading(false);
      })
      .catch(err=>{
        console.log(err)
        setIsLoading(false);
    })
  },[])


  const cardPlans = plans
  .sort((a, b) => a.id - b.id)
  .map((plan, id)=>{
    const delay = id * 100;
    const isHighlighted = plan.name === "Pacote Premium";
    return(
      <PlanCard key={id} style={{ 
        animationDelay: `${delay}ms`,
        backgroundColor: isHighlighted ? "#ff847c" : "#f2f2f2",
        }}
        >
        {isHighlighted && <BestSeller>MAIS COMPRADO</BestSeller>}
        <PlanName>{plan.name}</PlanName>
        <PlanPrice>R${plan.price}/mês ou por renovação</PlanPrice>
        <PlanDescription>{plan.description}</PlanDescription>
        <MaxTickets>Saldo de cotas: {plan.max_tickets}</MaxTickets>
        <ExpireDay>O saldo vence em {plan.campaign_duration} dias</ExpireDay>
        <MaxCampaign>Limite de campanha: {plan.max_campaigns}</MaxCampaign>
        <SupportEmail>Suporte via Email: {plan.support_email? "Sim" : "Não"}</SupportEmail>
        <SupportPhone>Suporte via WhatsApp: {plan.support_phone? "Sim": "Não"}</SupportPhone>
        <CustomLogo>Customizar a própria logo: {plan.custom_logo? "Sim": "Não"}</CustomLogo>
          <PurchaseButton onClick={() => handlePurchaseButtonClick(plan)} >
            {plan.name === user?.plans?.name &&  token ? "Renovar" : "Adquirir"}
          </PurchaseButton>
      </PlanCard>
    )
  })

    return(
        <>
            <PlansContainer>
            {isLoading ? (
              <SpinnerContainer>
                <StyledSpinner />
              </SpinnerContainer>
              ) : (
              <>
                {cardPlans}
              </>
            )}
            </PlansContainer>
        </>
    )
}
const PlansContainer = styled.div`
display: flex;
// background: green;
justify-content: space-around;
flex-direction: wrap;
box-sizing: border-box;
margin-top: 20px;
margin-bottom: 30px;
`;

const PlanCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 15px;
  width: 250px;
  height: 450px;
  background-color: #f2f2f2;
  border-radius: 40px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(1, 1, 2, 1);
  border: 4px solid ${props => (props.isHighlighted ? '#00FF00' : '#ff847c')};
  font-family: 'Nunito', sans-serif;

  opacity: 0;
  animation: fade-in 0.5s ease-in-out forwards;
  animation-delay: 0ms;

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

`;
const BestSeller = styled.p`
font-size: 14px;
  font-weight: bold;
  color: yellow;
  background-color: #ff847c;
  border-radius: 4px;
  padding: 8px 16px;
  position: absolute;
  top: 0px;
  right: 48px;
  transform: rotate(45deg) translateX(50%) translateY(-50%);
  margin: 0;
`;

const PlanName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const PlanPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;

`;

const PlanDescription = styled.p`
  font-size: 14px;
  margin-bottom: 15px;

`;
const MaxTickets = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const ExpireDay = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const MaxCampaign = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const SupportEmail = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const SupportPhone = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const CustomLogo = styled.p`
font-size: 14px;
margin-bottom: 10px;
`;
const PurchaseButton = styled.button`
background-color: #00cc66; 
color: #fff;
font-weight: bold;
border: none;
border-radius: 15px;
padding: 12px 24px; 
font-size: 22px; 
margin-top: auto; 
cursor: pointer;
border: 3px solid #4ba04f; 
&:hover{
  background: #4ba04f;
}
`;
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const StyledSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid red;
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