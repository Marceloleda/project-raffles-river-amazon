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
import Swal from 'sweetalert2';


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', mr: 1}}>
        <StyledLinearProgress 
          variant="determinate" 
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
  const [raffle, setRaffle] = useState({});
  const [defaultValue, setDefaultValue] = useState(1);
  const showModal = searchParams?.modal;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soldOff, setSoldOff] = useState(false)
  const [raffleDeleted, setRaffleDeleted] = useState(false)

  useEffect(() => {
    findRaffle(params.id, params.slug)
    .then((res) => {
      setRaffle(res.data);
        setProgress(((res.data.total_tickets - res.data.avaliable_tickets) / res.data.total_tickets) * 100);
        if(res?.data?.avaliable_tickets === 0){
          setSoldOff(true)
        }
        if(res?.data?.is_deleted === true){
          setRaffleDeleted(true)
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, []);
  

  const totalPrice = (defaultValue * raffle.ticket_price).toFixed(2); 

  const modal = () => {
    if(raffleDeleted){
      return Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "A campanha está indisponível! Entre em contato com o suporte para saber mais!",
      });
    }
    if(soldOff){
      return Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "A campanha está esgotada! Mas fique ligado para novidades!",
      });
    }
    if(defaultValue < 1){
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "É necessário pelo menos 1 número!",
      });
    }
    if(defaultValue > raffle?.avaliable_tickets){
      return Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: `Temos apenas ${raffle.avaliable_tickets} números da sorte disponíveis. Tente uma quantidade menor ;)`,
      });
    }
    const body = {
      raffleId: params.id,
      name: raffle.title,
      quantity: defaultValue,
      total: totalPrice,
      image: "../../assets/images/prizes.jpeg"
    };
    const bodyString = JSON.stringify(body);
    localStorage.setItem("bodyRaffle", bodyString);
    modalStatus()


    router.push(`${params.slug}/?modal=true`);
  };


  const modalStatus = () => {

    setIsModalOpen(true);
  };

  //tirar o modal quando aperta A TECLA ESC
  // const escModal = () => {
  //   router.push(`${params.slug}`);
  // }

  useEffect(() => {
    // Adiciona/remova a classe ao body com base no estado do modal
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // document.addEventListener('keydown', handleEscKey);   //tirar o modal quando aperta A TECLA ESC
    } else {
      document.body.style.overflow = 'auto';
      // document.removeEventListener('keydown', handleEscKey);   //tirar o modal quando aperta A TECLA ESC
    }
    
    // return () => {                                              //tirar o modal quando aperta A TECLA ESC
    //   document.removeEventListener('keydown', handleEscKey);
    // };
  }, [isModalOpen]);


  //tirar o modal quando aperta A TECLA ESC
  // const handleEscKey = (e) => {
  //   // Verifica se a tecla pressionada é a tecla "Esc" (código 27)
  //   if (e.keyCode === 27) {
  //     // Fecha o modal quando a tecla "Esc" for pressionada
  //     escModal();
  //   }
  // };

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
        <>
            {raffleDeleted?
              <SoldOffWord >
                <h1>Indisponível!</h1>
                <h1>Para mais informações entre em contato com o suporte!</h1>
              </SoldOffWord>
            :
            ""
            }
            {soldOff?
              <SoldOffWord>
                <h1>Esgotado!</h1>
              </SoldOffWord>
            :
            ""
            }
          <Conteiner $isSoldOff={soldOff} $isDeleted={raffleDeleted}>
            <ResponsiveImageRaffle>
              <Galleria />
            </ResponsiveImageRaffle>

            <ResponsiveInfoRaffle $modal={isModalOpen}>
                <div>
                  <h1>{raffle?.title}</h1>
                  <ModalPrice>
                    R$ {raffle?.ticket_price}
                  </ModalPrice>
                  <h2>Descrição: </h2>
                  <h3>{raffle?.description}</h3>
                </div>
              <Box sx={{ marginTop: "50px"}}>
                <h2 style={{fontSize: "16px", marginBottom: "5px", color: "red" }}>COTAS LIMITADAS! <br/>Garanta a sua agora e não fique de fora! Compre agora!</h2>
                <LinearProgressWithLabel 
                  value={progress} 
                  />
                {/* <LinearProgress sx={{ width: "91.7%" }}/> */}
              </Box>
            </ResponsiveInfoRaffle>
            <ResponsiveModelButtons>
              <ResponsiveButtonsPlus>
                <SetNumber onClick={() => handleIncrementSet(10)}>Adicionar +10</SetNumber>
                <SetNumber onClick={() => handleIncrementSet(25)}>Adicionar +25</SetNumber>
                <SetNumber onClick={() => handleIncrementSet(100)}>Adicionar +100</SetNumber>
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
            </ResponsiveModelButtons>
            {showModal && (
              <>
                <BasicModal onSetStateModal={setIsModalOpen}/>
                <Overlay />
              </>
            )}
          </Conteiner>
        </>
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

const ModelButtons = styled.div`
display: flex;
justify-content: center;
align-items: center;
background: #f7f7d7;
flex-direction: column;
border: 1px solid black ;
border-radius:10px;
margin-top: -7px;
border-top: 0; 
border-top-left-radius: 0;
border-top-right-radius: 0;

margin-bottom: 27px;
  width: auto;
  max-width: 580px; 
  padding: 15px; 
  min-width: 525px;

`;
const ResponsiveModelButtons = styled(ModelButtons)`
@media (max-width: 900px) {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 70%;

  padding: 15px; 
  width: 85%; 
  max-width: 580px; 
  min-width: 315px; 
}
`;

const SoldOffWord = styled.div`
display: flex;
flex-direction: column;
align-items: center;
font-size: 37px;
color: red;
margin-top: 20px;
font-family: 'Arial', sans-serif; 
text-transform: uppercase; 
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

`;

const Conteiner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f7f2e6;
    flex-direction: column;
    min-height: 100vh; 
    opacity: ${props => props.$isSoldOff || props.$isDeleted? '0.5' : '1'}; 

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
  border-bottom: 0;
  background: #f2ef91;
  // background: #EAE639;
  margin-top: 25px;
  margin-bottom: -5px;
  width: auto;
  max-width: 580px; 
  padding: 15px; 
  min-width: 525px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.7);
  z-index: 3;
  opacity: ${(props)=> props.$modal? "0.5" : "1"};


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
    margin-top: 10px;
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
    margin-bottom: 20px;
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
width:150px;
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
border: 2px solid #00e5c3 ;
&:hover{
  background: #13f77d;
}
font-size: 16px;
width: 100px;
height: 57px;
background: #C2EFEE;
box-shadow: 0 1px 2px rgba(1, 1, 1, 1.5);


`;
const Plus = styled.div`
display:flex;
justify-content: space-between;
margin-top: 30px;
margin-bottom: 10px;

width: 400px;
height: 80px;
`;

const ResponsiveButtonsPlus = styled(Plus)`
  @media (max-width: 900px) {
    width: 320px;
  }
`;

