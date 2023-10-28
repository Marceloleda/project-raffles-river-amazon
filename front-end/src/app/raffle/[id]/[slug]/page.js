'use client'
import { buyTicket, findRaffle } from '../../../../services/api';
import Galleria from "../../../../components/galleria/index";
import Logo from '../../../../assets/images/logo_main.png'
import Link from "next/link";
import Image from 'next/image';
import picLogo from '../../../../assets/images/picLogo.png'
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import { BasicModal } from '../../../../components/buyerModal/page';
import Header from '../../../../components/header';
// import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';


 
export default function Page({ params, searchParams }) {
  // const [progress, setProgress] = useState(10);
  const router = useRouter();
  const [raffle, setRaffle] = useState([]);
  const [defaultValue, setDefaultValue] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const showModal = searchParams?.modal;
  // function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  //   return (
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Box sx={{ width: '100%', mr: 1 }}>
  //         <LinearProgress variant="determinate" {...props} />
  //       </Box>
  //       <Box sx={{ minWidth: 35 }}>
  //         <Typography variant="body2" color="text.secondary">{`${Math.round(
  //           props.value,
  //         )}%`}</Typography>
  //       </Box>
  //     </Box>
  //   );
  // }

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    findRaffle(params.id, params.slug)
      .then((res) => {
        setRaffle(res.data);
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
          <ConteinerHeader>
            <Image
               src={Logo} 
               alt="Logo"
               width={75} 
               height={75}
               style={{marginRight: "60px"}} 
            />
            <h1>Rifas Rio Amazonas</h1>
        </ConteinerHeader>
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
          </ResponsiveInfoRaffle>
          {/* <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
              <h1>Restam: {raffle?.avaliable_tickets} tickets</h1> */}
          <ResponsiveButtonsPlus>
            <SetNumber onClick={() => handleIncrementSet(5)}>+5</SetNumber>
            <SetNumber onClick={() => handleIncrementSet(10)}>+10</SetNumber>
            <SetNumber onClick={() => handleIncrementSet(20)}>+20</SetNumber>
          </ResponsiveButtonsPlus>

          <Quatity>
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
          </Quatity>
          <Total_Value>Total: R$ {totalPrice}</Total_Value>
          <ResponsiveButtonBuy onClick={modal}>Comprar</ResponsiveButtonBuy>
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
  border-radius:10px;
  border: 1px solid black ;
  // background: #f7ecd2;
  background: #EAE639;
  margin-top: 25px;
  width: auto;
  max-width: 580px; 
  padding: 15px; 

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
    background: #EAE639;
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

const Total_Value = styled.p`
font-family: 'Roboto', sans-serif;
margin-bottom: 30px;
font-size:35px;
color:black;
font-weight: bold;

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
border-radius: 10px;
background: #fc923c;
font-weight: bold;
margin-bottom: 80px;
border: none;
border: 2px solid #f77811 ;
cursor:pointer;

&:hover{
  background: #f77811;
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
width:80px;
height: 50px;
border-radius: 15px;
border: none;
font-size: 25px;
`;
const Quatity = styled.div`
display:flex;
justify-content: space-around;
width: 300px;
height: 80px;
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

