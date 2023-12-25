import {findTicket } from "../../services/api";
import {useState } from "react";
import {styled } from "styled-components";
import {useRouter } from 'next/navigation';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import { IMaskInput } from "react-imask";
import { Alert, AlertTitle } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';


export default function FindTickets() {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState({});

  const [buyer, setBuyer] = useState({
    email: '',
    phone_number:''
})

  function findTicketData(event){
    event.preventDefault();
    setIsLoading(true);

    findTicket(buyer.email, buyer.phone_number)
    .then((res) => {
      setIsLoading(false);
      setTicketData(res.data)

      // router.push(`/payment-buyer/${mercadoPago.id}`)
    })
    .catch((err) => {
      console.log(err.message);
      setIsLoading(false);
    });

  }

  return (
  <>
    <Container>
      <Raffle>
        <Title>
          <ConfirmationNumberIcon fontSize="large"/>
          <h1>Meus Bilhetes</h1>
        </Title>
        <form onSubmit={findTicketData}>
          <InputContainer>
            <IconContainer>
              <EmailIcon />
            </IconContainer>
            <InputBuscar 
              id="email" 
              $isloading={isLoading}
              type="email" 

              placeholder="Email" 
              value={buyer.email} onChange={(e)=>
              setBuyer({...buyer, email: e.target.value})
              }required
            />
          </InputContainer>
          <InputContainer>
            <IconContainer>
              <PhoneIcon />
            </IconContainer>
            <InputBuscar
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
          </InputContainer>
          <Popup>
            <Alert severity="info">
              <AlertTitle>Informação</AlertTitle>                            
              <h3>Insira os dados que utilizou para efetuar a compra.</h3>
            </Alert>
          </Popup>
          {ticketData?.message === "Not Found!"?
            <Popup>
              <Alert severity="error">Não foi encontrado nenhum ticket com esses dados!</Alert>
            </Popup>
          :
          ""
        }

          <Button type="submit" $isloading={isLoading} disabled={isLoading}>
            <SearchIcon style={{marginRight:"5px"}} />
            {
              isLoading? 
              (<SpinnerContainer>
                Buscando
                <StyledSpinner />
              </SpinnerContainer>): "Buscar"
            }
             
          </Button>
        </form>
        {/* <DeleteButton onClick={() => router.refresh()}>
          Retornar
        </DeleteButton> */}
      </Raffle>
    </Container>
  </>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content:center;
`;

const Title = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content:center;
  margin-bottom: 15px;

  h1{
    font-family: 'Montserrat', sans-serif;
    font-size: 20px; 
    font-weight: 700;
    margin-left: 7px;
  }
`;

const Raffle = styled.div`
  height: 100%;
  width: 450px;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  margin-top: 70px;

  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;
const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  margin-bottom: 7px;
`;

const InputBuscar = styled(IMaskInput)`
width: 100%;
height: 58px;
font-size: 21px;
margin-bottom: 16px;
background-color: ${(props) => (props.$isloading ? '#F5F5F5' : '#FFFFFF')};
border: 1px solid #D5D5D5;
padding: 10px;
box-sizing: border-box;
pointer-events: ${(props) => (props.$isloading ? 'none' : 'auto')};
cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'text')};
opacity: ${(props) => (props.$isloading ? '0.7' : '1')};  
border: none; /* Remova a borda padrão */
border-bottom: 1px solid #D5D5D5; /* Adicione uma borda inferior */

&:focus {
  outline: none; /* Remova a borda de foco */
  border-bottom: 2px solid #2ce080; /* Adicione uma borda inferior diferente durante o foco */
}

  &:first-child {
      margin-top: 25px;
  }

`;
const SpinnerContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
`;

const StyledSpinner = styled.div`
  width: 25px;
  height: 25px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid purple;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left:15px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const DeleteButton = styled.button`
  display: flex;
  justify-content:center;
  align-items: center;
  height: 30px;
  background-color: #ff847c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e74c3c;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 60px;

  // background-color: #56bc86;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;


  background: ${(props) => (props.$isloading ? '#999999' : '#56bc86')};

  cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'pointer')};
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    &:hover {
      ${(props) => (props.$isloading === true ? '' : 'background-color: #2ce080;')}
    }
}`;

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