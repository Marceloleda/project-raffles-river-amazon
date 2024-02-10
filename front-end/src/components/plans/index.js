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
    if(storedToken){
      findUser()
      .then((res)=>{
        setUser(res.data)
        setToken(storedToken);
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
        {isHighlighted && <BestSeller>POPULAR</BestSeller>}
        <PlanName>{plan.name}</PlanName>
        <PlanPrice><p>Pré-pago</p> <br/><h1>R$ {plan.price}</h1> </PlanPrice>
        <PlanDescription>{plan.description}</PlanDescription>
        <MaxTickets><p>Saldo de cotas:</p> <h1> {plan.max_tickets}</h1></MaxTickets>
        <ExpireDay>O saldo vence em <h1>{plan.campaign_duration} dias</h1> </ExpireDay>
        <MaxCampaign>Limite de campanha: <h1>{plan.max_campaigns}</h1></MaxCampaign>
        <SupportEmail>Suporte via Email: <h1>{plan.support_email? "Sim" : "Não"}</h1></SupportEmail>
        <SupportPhone>Suporte via WhatsApp: <h1>{plan.support_phone? "Sim": "Não"}</h1></SupportPhone>
        <CustomLogo>Customizar a própria logo: <h1>{plan.custom_logo? "Sim": "Não"}</h1></CustomLogo>
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
  height: 475px;
  background-color: #f2f2f2;
  border-radius: 40px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(1, 1, 2, 1);
  border: 4px solid ${props => (props.isHighlighted ? '#00FF00' : '#ff847c')};
  font-family: 'Nunito', sans-serif;

  opacity: 0;
  animation: fade-in 0.5s ease-in-out forwards;
  animation-delay: 0ms;
  transition: box-shadow 0.3s ease, margin-top 0.3s ease;

  &:hover {
    box-shadow: 0 4px 9px rgba(5, 5, 5, 1.5); /* Aumenta a sombra quando o mouse está sobre a div */
    margin-top: -5px;
  }

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
font-size: 17px;
  font-weight: bold;
  color: yellow;
  background-color: #ff847c;
  border-radius: 4px;
  padding: 8px 16px;
  position: absolute;
  top: 0px;
  right: 40px;
  transform: rotate(45deg) translateX(50%) translateY(-50%);
  margin: 0;
  font-family: 'Montserrat', sans-serif;
`;

const PlanName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const PlanPrice = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  margin-bottom: 20px;
  h1{
    font-weight: bold;
    font-family: 'Open Sans', sans-serif;
    font-size: 20px;
  }

`;

const PlanDescription = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  font-family: 'Open Sans', sans-serif;
`;
const MaxTickets = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;

h1{
  font-weight: bold;
  margin-left: 5px;
}
`;
const ExpireDay = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;
h1{
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;

}
`;
const MaxCampaign = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;

h1{
  font-weight: bold;
  margin-left: 5px;
}
`;
const SupportEmail = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;

h1{
  font-weight: bold;
  margin-left: 5px;
}
`;
const SupportPhone = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;
h1{
  font-weight: bold;
  margin-left: 5px;
}
`;
const CustomLogo = styled.div`
display: flex;
font-size: 16px;
margin-bottom: 10px;
font-family: 'Open Sans', sans-serif;
h1{
  font-weight: bold;
  margin-left: 5px;
}

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