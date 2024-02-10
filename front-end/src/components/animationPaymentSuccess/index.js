'use client'

import { useWindowSize } from "@uidotdev/usehooks";
import lottie from "lottie-web";
import { useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import animationDataJson from "../../assets/animations/Animation - 1.json"
import styled from "styled-components";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Imag from "../../assets/images/prizes.jpeg"
import Image from "next/image";
import { findBuyerByIdSuccessPayment } from "../../services/api";
import { useRouter } from "next/navigation";

export default function SuccessPayment({onDataMercadoPagoBuyer, setModelSchroll}) {
  let dataRaffle
  const animationContainer = useRef(null);
  const [ticketData, setTicketData] = useState({});
  const [hasData, setHasData] = useState(false);
  const router =useRouter()

  const data = new Date(ticketData?.numbers_reservations?.reservation_date);
  const formato = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const dataFormatada = data.toLocaleString('pt-BR', formato);

   window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  if (typeof window !== 'undefined') {
    const bodyString = localStorage.getItem("bodyRaffle");
    dataRaffle = JSON.parse(bodyString);
  }

  useEffect(() => {
    findBuyerByIdSuccessPayment(String(onDataMercadoPagoBuyer?.id))
    .then((res) => {
      // setIsLoading(false);
      if(res?.data?.message === "Not Found!"){
        console.log(res)
        setTicketData(res.data)
      }
      if(res?.data?.message !== "Not Found!"){
        setTicketData(res.data)
        setHasData(true)
      }

    })
    .catch((err) => {
      console.log(err.message);
    });

    const animation = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationDataJson,
    });

    // Cleanup
    return () => {
      animation.destroy(); // Limpa a animação ao desmontar o componente
    };
  }, []);

  const ticketNumbers = ticketData?.numbers_reservations?.ticket_numbers

  const { width, height } = useWindowSize()

  return (
    <PaymentSuccess>
      <h1>Pagamento confirmado!</h1>
      <ReactConfetti width={width} height={height} recycle={false} gravity={0.07} numberOfPieces={1000} wind={0.01}/>
      <div ref={animationContainer} />
      <Raffle>
        <Title>
          <ConfirmationNumberIcon fontSize="large"/>
          <h1>Meus Bilhetes</h1>
        </Title>

        <BuyerData>
          {/* <h1>Rifa:</h1> */}
          <ImageRaffle>
              <Image 
              src={Imag}
              width={100}
              style={{borderRadius: "15px"}}
              alt="pic raffle success"
              />
            <div>
              <h3>Rifa: {onDataMercadoPagoBuyer.description}</h3> 
              <br/>
              <h3>Total de Bilhetes: {ticketData?.purchase?.quantity_tickets}</h3>
            </div>
          </ImageRaffle>
          <h2>
            <span style={{ fontWeight: 'bold' }}>ID: </span><span style={{ color: "black" }}>{onDataMercadoPagoBuyer.id} </span>
          </h2>
          <h2>
            <span style={{ fontWeight: 'bold' }}>Nome: </span><span style={{ color: "black" }}>{ticketData?.buyer?.full_name} </span>
          </h2>
          <h2>
            <span style={{ fontWeight: 'bold' }}>Email: </span><span style={{ color: "black" }}>{ticketData?.buyer?.email} </span>
          </h2>
          <h2>
            <span style={{ fontWeight: 'bold' }}>Celular: </span><span style={{ color: "black" }}>{ticketData?.buyer?.phone} </span>
          </h2>

          <h1>Bilhetes</h1>
          <Numbers>
          {ticketNumbers?.map((number, index)=>{
            return (
                <BoxNumber key={index}>{number}</BoxNumber>
              )
          })}
            </Numbers>
          <h2>
            <span style={{ fontWeight: 'bold' }}>Data da compra: </span> <br/><span style={{ color: "black" }}>{dataFormatada} </span>
          </h2>

        </BuyerData>
        <BackButton 
          onClick={()=>{
            setModelSchroll(false)
            router.back()
          }}>
          Retornar
        </BackButton>
      </Raffle>
    </PaymentSuccess>
  )
};
const ImageRaffle = styled.div`
display: flex;
width: 100%;
border-radius: 10px;
background: #e5f8e5;
padding: 5px;

margin: 5px;
h3{
  font-size: 14px;
  margin-left: 10px;
}
`;
const PaymentSuccess = styled.div`

  h1{
    color: #2ee22e;

  }
`;

const BuyerData = styled.div`
display: flex;
flex-direction: column;
width: 100%;
text-align: left;

h1{
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  margin-top:20px;
}
h2{
  font-family: 'Montserrat', sans-serif;
  margin-top:17px;
  font-size: 18px;
  color: #2ee22e;

}

`;

const Numbers = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-around;

margin-top: 15px;

`;

const BoxNumber = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 35px;
width: 80px;
background: #fc923c;
border: 2px solid #665c5c;
border-radius: 10px;
font-size: 16px;
margin-bottom: 10px;
padding: 1px;


`;
const Title = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content:center;
  margin-bottom: 15px;

  h1{
    font-family: 'Montserrat', sans-serif;
    font-size: 22px; 
    font-weight: 700;
    margin-left: 7px;
  }
`;

const Raffle = styled.div`
  height: 100%;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;

  display: flex;
  flex-direction: column;

  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const BackButton = styled.button`
  display: flex;
  justify-content:center;
  align-items: center;
  height: 35px;
  margin-top: 25px;
  background-color: #ff847c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 19px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e74c3c;
  }
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