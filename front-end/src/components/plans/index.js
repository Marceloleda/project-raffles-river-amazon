'use client';

import { findPlans, findUser } from "../../services/api";
import CreatePayments from "../../services/paymentPlan";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from 'next/navigation';
import { FaRegCheckCircle, FaRegTimesCircle, FaWhatsapp, FaBrush } from 'react-icons/fa';

const primaryColor = '#ff847c';
const secondaryColor = '#2ecc71';
const highlightColor = '#ffcc5c';

export default function Plans() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  const handlePurchaseButtonClick = (plan) => {
    CreatePayments(plan.name, router);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      findUser()
        .then((res) => {
          setUser(res.data);
          setToken(storedToken);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    findPlans()
      .then((response) => {
        setPlans(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const cardPlans = plans
    .sort((a, b) => a.id - b.id)
    .map((plan, id) => {
      const delay = id * 100;
      const isHighlighted = plan.name === "Pacote Premium";
      return (
        <PlanCard key={id} style={{ 
          animationDelay: `${delay}ms`,
          background: isHighlighted ? highlightColor : "#fff",
        }}>
          {isHighlighted && <BestSeller>POPULAR</BestSeller>}
          <PlanName>{plan.name}</PlanName>
          <PlanPrice $highlighted={isHighlighted}><p>Pré-pago</p> <h1>R$ {plan.price}</h1></PlanPrice>
          <PlanDescription $highlighted={isHighlighted}>{plan.description}</PlanDescription>
          <PlanDetails $highlighted={isHighlighted}>
            Saldo de cotas: <h1>{plan.max_tickets}</h1>
          </PlanDetails>
          <PlanDetails $highlighted={isHighlighted}>
            O saldo vence em <h1>{plan.campaign_duration} dias</h1>
          </PlanDetails>
          <PlanDetails $highlighted={isHighlighted}>
            Limite de campanha: <h1>{plan.max_campaigns}</h1>
          </PlanDetails>
          <PlanDetails $highlighted={isHighlighted}>
            Suporte via Email: <h1>{plan.support_email ? <FaRegCheckCircle /> : <FaRegTimesCircle />}</h1>
          </PlanDetails>
          <PlanDetails $highlighted={isHighlighted}>
            Suporte via WhatsApp: <h1>{plan.support_phone ? <FaWhatsapp /> : <FaRegTimesCircle />}</h1>
          </PlanDetails>
          <PlanDetails $highlighted={isHighlighted}>
            Customizar a própria logo: <h1>{plan.custom_logo ? <FaBrush /> : <FaRegTimesCircle />}</h1>
          </PlanDetails>
          <PurchaseButton onClick={() => handlePurchaseButtonClick(plan)}>
            {plan.name === user?.plans?.name && token ? "Renovar" : "Adquirir"}
          </PurchaseButton>
        </PlanCard>
      );
    });

  return (
    <PlansContainer>
      {isLoading ? (
        <SpinnerContainer>
          <StyledSpinner />
        </SpinnerContainer>
      ) : (
        cardPlans
      )}
    </PlansContainer>
  );
}

const PlansContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 20px auto;
  padding: 20px;
  width: 100%;
  background: #f0f0f5;
`;

const PlanCard = styled.div`
   position: relative;
  display: flex;
  flex-direction: column;
  margin: 15px;
  width: 340px;
  height: 475px;
  background: linear-gradient(135deg, #ffffff 0%, #f7f7fa 100%);
  border: none;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease-in-out forwards;
  animation-delay: 0ms;
  transition: box-shadow 0.3s ease, margin-top 0.3s ease;
  
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
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

const BestSeller = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #fff;
  background: ${secondaryColor};
  border-radius: 0 15px 0 15px;
  padding: 8px 16px;
  position: absolute;
  top: -25px;
  right: 0;
  z-index: 1;
`;

const PlanName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const PlanPrice = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  margin-bottom: 20px;
  text-align: center;

  p {
    margin: 0;
    font-size: 0.9rem;
    margin-bottom: 7px;

    color: ${({ $highlighted }) => ($highlighted ? '#fff' : '#888')};
  }

  h1 {
    font-weight: bold;
    font-size: 2rem;
    color: ${({ $highlighted }) => ($highlighted ? '#fff' : primaryColor)};
    margin: 0;
  }
`;

const PlanDescription = styled.div`
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.5;
  text-align: center;
  color: ${({ $highlighted }) => ($highlighted ? '#555' : '#555')};
`;

const PlanDetails = styled.div`
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-weight: bold;
    color: ${({ $highlighted }) => ($highlighted ? '#fff' : 'black')};
  }

  svg {
    margin-left: 5px;
    color: ${({ $highlighted }) => ($highlighted ? '#fff' : highlightColor)};
  }
`;

const PurchaseButton = styled.button`
  background: linear-gradient(90deg, ${secondaryColor} 0%, #00b359 100%);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 1rem;
  margin-top: auto;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #00b359 0%, ${secondaryColor} 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 12px;
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
  border-top: 5px solid ${primaryColor};
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
