'use client'
import { findRaffle } from '../../services/api';
import Galleria from "../galleria/index";
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import { BasicModal } from '../buyerModal/page';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <StyledLinearProgress 
          variant="determinate" 
          color="success"
          {...props} 
        />
      </Box>
      <Box sx={{ minWidth: 25 }}>
        <Typography variant="body1" color="text">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function Raffle({params, searchParams}) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [raffle, setRaffle] = useState([]);
  const [defaultValue, setDefaultValue] = useState(1);
  const showModal = searchParams?.modal;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    findRaffle(params.id, params.slug)
    .then((res) => {
      setRaffle(res.data);
        setProgress(((res.data.total_tickets - res.data.avaliable_tickets) / res.data.total_tickets) * 100);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, []);

  const totalPrice = (defaultValue * raffle.ticket_price).toFixed(2); 

  const modal = () => {
    if(defaultValue < 1){
      return alert("É NECESSARIO A QUANTIDADE DE PELO MENOS 1 NÚMERO DA SORTE")
    }
    if(defaultValue > raffle?.avaliable_tickets){
      return alert("NÃO É POSSIVEL COMPRAR ESSA QUANTIDADE")
    }

    const body = {
      raffleId: params.id,
      name: raffle.title,
      quantity: defaultValue,
      total: totalPrice,
    };
    const bodyString = JSON.stringify(body);
    localStorage.setItem("bodyRaffle", bodyString);

    router.push(`${params.slug}/?modal=true`);
  };

  const handleIncrementSet = (value) => {
    setDefaultValue(defaultValue + value);
  };

  const handleIncrement = () => {
    setDefaultValue(defaultValue + 1);
  };

  const handleDecrement = () => {
    if (defaultValue > 0) {
      setDefaultValue(defaultValue - 1);
    }
  };

  const handleInputChange = (e) => {
    const parsedValue = parseFloat(e.target.value);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setDefaultValue(parsedValue);
    }
  };


  return (
    <>
      {isLoading ? (
        <SpinnerContainer>
          <StyledSpinner />
        </SpinnerContainer>
      ) : (
        <Conteiner>
          
          <ResponsiveImageRaffle>
            <Galleria/>
          </ResponsiveImageRaffle>

          <ResponsiveInfoRaffle>
              <div>
                <h1>{raffle?.title}</h1>
                <ModalPrice>
                  R$ {raffle?.ticket_price}
                </ModalPrice>
                <h2>Descrição: </h2>
                <h3>{raffle?.description}</h3>
              </div>
            <Box sx={{ marginTop: "50px"}}>
              <h2 style={{fontSize: "18px", marginBottom: "5px" }}>COTAS LIMITADAS! Garanta a sua agora e não fique de fora!</h2>
              <LinearProgressWithLabel 
                value={progress} 
                />
              {/* <LinearProgress sx={{ width: "91.7%" }}/> */}
            </Box>
          </ResponsiveInfoRaffle>
          <ResponsiveButtonsPlus>
            <SetNumber onClick={() => handleIncrementSet(5)}>+5</SetNumber>
            <SetNumber onClick={() => handleIncrementSet(10)}>+10</SetNumber>
            <SetNumber onClick={() => handleIncrementSet(20)}>+20</SetNumber>
          </ResponsiveButtonsPlus>

          <ResponsiveQuatity>
            <ButtonQuantity onClick={handleDecrement}>-</ButtonQuantity>
            <InputQuantity
              type="text" 
              value={defaultValue}
              onChange={handleInputChange}
              min="0"
              inputMode="numeric" 
              pattern="\d*" 
            />
            <ButtonQuantity onClick={handleIncrement}>+</ButtonQuantity>
          </ResponsiveQuatity>
          <Total_Value><h1>Total:</h1> <h2> R$ {totalPrice}</h2> </Total_Value>
          <ResponsiveButtonBuy onClick={modal}>
            <h1>Comprar</h1>
            </ResponsiveButtonBuy>
          {showModal && (
            <>
              <BasicModal />
              <Overlay />
            </>
          )}
        </Conteiner>
      )}
    </>
  );
}
const StyledLinearProgress = styled(LinearProgress)`
  && {
    height: 25px;
    border: 5px double #bbeabe;
    background-image: repeating-linear-gradient(
      45deg,
      #ffffff,
      #ffffff 10px,
      #f3f3f3 10px,
      #f3f3f3 20px
    );
    animation: movingStripes 25s linear infinite;
    background-size: 200% 100%;
  }

  @keyframes movingStripes {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const Conteiner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f7f2e6;
    flex-direction: column;
    min-height: 100vh; 
`;
const ConteinerHeader = styled.div`
    position: top;
    background-color: #D6E5E3; 
    box-sizing: border-box;
    width: 100%;
    padding: 15px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    h1{
        font-family: 'Nunito', sans-serif;
        font-size: 40px; 
        font-weight: 700;
    }
    h2{
        font-size: 25px; 
        color: black; 
    }

`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    background: #f2f2f2;
    align-items: center;
    min-height: 100vh; 
`;
const StyledSpinner = styled.div`
  width: 50px;
  height: 50px;
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

const InfoRaffle = styled.div`
  display: flex;
  flex-direction: column;
  border-radius:10px;
  border: 1px solid black ;
  background: #f2ef91;
  // background: #EAE639;
  margin-top: 25px;
  width: auto;
  max-width: 580px; 
  padding: 15px; 
  min-width: 525px;
  h1 {
    font-family: 'Raleway', sans-serif;
    font-size: 32px;
    color: black;
    margin-bottom: 25px;
  }
  
  h2 {
    font-family: 'Raleway', sans-serif;
    font-size: 20px;
    font-weight: bold;
  }
`;

const ResponsiveInfoRaffle = styled(InfoRaffle)`
  @media (max-width: 900px) {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: #f2ef91;
    margin-top: 25px;
    height: 70%;

    padding: 15px; 
    width: 85%; 
    max-width: 580px; 
    min-width: 315px; 
  }
`;
const Overlay = styled.div`
position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.55);
transition: opacity 0.9s;
`;

const Total_Value = styled.div`
  display:flex;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 30px;
  
  h1{
  font-size: 28px;
  font-weight: bold;
  }
  h2{
    font-size: 28px;
  }

`;
const ImageRaffle = styled.div`
margin-top: 25px;

`;
const ResponsiveImageRaffle = styled(ImageRaffle)`
  @media (max-width: 900px) {
    margin-top: 0px;
  }
`;
const ButtonBuy = styled.button`
  width:400px;
  height: 50px;
  border-radius: 25px;
  background: #fc923c;
  font-weight: bold;
  margin-bottom: 80px;
  border: none;
  border: 2px solid #f77811 ;
  cursor:pointer;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  h1{
    font-size: 28px;
    font-weight: bold;
    }

  &:hover{
    background: #f77811;
    box-shadow: 0 1px 2px rgba(1, 1, 1, 1.5);
  }
`;
const ModalPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  width:auto;
  height: 30px;
  margin-bottom: 25px;

  background: #fc923c;
  border-radius: 10px;

`;
const ResponsiveButtonBuy = styled(ButtonBuy)`
  @media (max-width: 900px) {
    width:200px;
    margin-bottom: 80px;
  }
`;

const ButtonQuantity = styled.button`
  width: 80px;
  height: 55px;
  background: red;
  border-radius: 15px;
  cursor:pointer;
  border: none;
  border: 2px solid #961701 ;
  font-size: 30px;

  &:hover{
    background: #ff5c3f;
  }

  &:nth-child(3) {
    background: #3ee83e;
    border: 2px solid #0cd11c ;
    &:hover{
      background: #13f77d;
    }
  }
`;
const InputQuantity = styled.input`
display:flex;
align-items: center;
text-align: center;
width:180px;
height: 50px;
border-radius: 15px;
border: none;
font-size: 25px;
`;
const Quatity = styled.div`
display:flex;
justify-content: space-around;
width: 400px;
height: 80px;
`;
const ResponsiveQuatity = styled(Quatity)`
@media (max-width: 405px) {
  width: 375px;
}
@media (max-width: 380px) {
  width: 355px;
}
`;
const SetNumber = styled.button`
display:flex;
justify-content:center;
align-items:center;
border:none;
cursor: pointer;
border-radius:10px;
border: 2px solid #13f77d ;
&:hover{
  background: #13f77d;
}

width: 100px;
height: 30px;
background: #C2EFEE;

`;
const Plus = styled.div`
display:flex;
justify-content: space-between;
margin-top: 30px;
margin-bottom: 0px;

width: 400px;
height: 80px;
`;

const ResponsiveButtonsPlus = styled(Plus)`
  @media (max-width: 900px) {
    width: 320px;
  }
`;

