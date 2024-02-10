import {findTicket } from "../../services/api";
import {useState } from "react";
import {styled } from "styled-components";
import {useRouter } from 'next/navigation';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import { IMaskInput } from "react-imask";
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Image from "next/image";
import Imag from "../../assets/images/prizes.jpeg"
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {

  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

export default function FindTickets({onHandleBackRaffle}) {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState({});
  const [hasTicketData, setHasTicketData] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);

  };

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
      if(res?.data?.message === "Not Found!"){
        setTicketData(res.data)
      }
      if(res?.data?.message !== "Not Found!"){
        setTicketData(res.data)
        setHasTicketData(true)
      }

    })
    .catch((err) => {
      console.log(err.message);
      setIsLoading(false);
    });

  }
  const ticketNumbers = ticketData?.tickets?.ticket_numbers
  const data = new Date(ticketData?.tickets?.reservation_date);

  const formato = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

  const dataFormatada = data.toLocaleString('pt-BR', formato);

  return (
  <>
    <Container>
      <Raffle>
        <Title>
          <ConfirmationNumberIcon fontSize="large"/>
          <h1>Meus Bilhetes</h1>
        </Title>
        {hasTicketData === false? 
        <>
          <form onSubmit={findTicketData}>
          <Box
              sx={{
                bgcolor: 'background.paper',
                width: "100%",
                position: 'relative',
                minHeight: 150,
              }}
            >
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="action tabs example"
                >
                  <Tab 
                    label="Email" 
                    onClick={(e)=>
                      setBuyer({...buyer, phone_number: ''})
                      } 
                      {...a11yProps(0)} 
                  />
                  <Tab 
                  label="Celular" 
                  onClick={(e)=>
                    setBuyer({...buyer, email: ''})
                    }
                  {...a11yProps(1)} 
                  />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabPanel value={value} index={0} dir={theme.direction}>
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
                      }
                    />
                  </InputContainer>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
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
                    />
                  </InputContainer>
                </TabPanel>
              </SwipeableViews>
            </Box>            
            
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
            <BackButton onClick={onHandleBackRaffle}>
              Retornar
            </BackButton>
        </>
        :
        <BuyerData>
          {ticketData?.dataRaffle?
            ticketData.dataRaffle.map((data, index)=>{
              const dataReservation = new Date(data?.tickets?.reservation_date);
              const dataFormatadaArr = dataReservation.toLocaleString('pt-BR', formato);
              return (
                <Accordion style={{marginTop: 15, background: `${index % 2 !== 1 ? "#eaf7ea" : "#f7f7f7"}`}} key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <ImageRaffle $index={index}>
                        <Image 
                        src={Imag}
                        alt="image raffle"
                        width={80}
                        style={{borderRadius: "15px"}}
                        />
                      <div>
                        <h3>
                          <span style={{ fontWeight: 'bold' }}>Rifa:</span> {data?.raffle?.title}
                        </h3>
                        <br />
                        <h3>
                          <span style={{ fontWeight: 'bold' }}>Bilhetes:</span> {data?.tickets?.ticket_numbers?.length}
                        </h3>
                        <br />

                        <h3>
                          <span style={{ fontWeight: 'bold' }}>Total:</span> R$ {data?.tickets?.ticket_numbers?.length * data?.raffle?.ticket_price}
                        </h3>
                      </div>  

                    </ImageRaffle>
                  </AccordionSummary>
                  <AccordionDetails>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>ID: </span>{data?.purchase?.payment_id}
                    </h3>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Nome: </span>{ticketData?.full_name}
                    </h3>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Email: </span>{ticketData?.email}
                    </h3>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Celular: </span>{ticketData?.phone}
                    </h3>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Valor da cota:</span> R$ {data?.raffle?.ticket_price}
                    </h3>
                    <br/>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Status do Pagamento:</span> {data?.purchase?.payment_status === "approved"? "Aprovado" : "-"}
                    </h3>
                    <h1>Bilhetes</h1>
                    <Numbers>
                    {data.tickets?.ticket_numbers.map((number, index)=>{
                      return (
                          <BoxNumber key={index}>{number}</BoxNumber>
                        )
                    })}
                      </Numbers>

                    <h1>Data da compra: </h1> <h2>{dataFormatadaArr}</h2>
                  </AccordionDetails>
                </Accordion>
              )
            })
            :
            <>
              <ImageRaffle style={{background: "#eaf7ea"}}>
                  <Image 
                  src={Imag}
                  alt="image raffle"
                  width={100}
                  style={{borderRadius: "15px"}}
                  />
                  <div>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Rifa:</span> {ticketData?.raffle?.title}
                    </h3>
                    <br />
                    <br />
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Bilhetes:</span> {ticketData?.tickets?.ticket_numbers?.length}
                    </h3>
                    <h3>
                      <span style={{ fontWeight: 'bold' }}>Total:</span> R$ {ticketData?.tickets?.ticket_numbers?.length * ticketData?.raffle?.ticket_price}
                    </h3>
                  </div> 
              </ImageRaffle>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>ID: </span>{ticketData?.purchase?.payment_id}
                </h3>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>Nome: </span>{ticketData?.full_name}
                </h3>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>Email: </span>{ticketData?.email}
                </h3>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>Celular: </span>{ticketData?.phone}
                </h3>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>Valor da cota:</span> R$ {ticketData?.raffle?.ticket_price}
                </h3>
                <br/>
                <h3>
                  <span style={{ fontWeight: 'bold' }}>Status do Pagamento:</span> {ticketData?.purchase?.payment_status === "approved"? "Aprovado" : "-"}
                </h3>
                <h1>Bilhetes</h1>
              <Numbers>
              {ticketNumbers?.map((number, index)=>{
                return (
                    <BoxNumber key={index}>{number}</BoxNumber>
                  )
              })}
                </Numbers>

              <h1>Data da compra: </h1> <h2>{dataFormatada}</h2>
            </>

          }

        <BackButton onClick={()=>setHasTicketData(false)}>
          Retornar
        </BackButton>
        </BuyerData>
        }
      </Raffle>
    </Container>
  </>
  );
}

const Container = styled.div`
display: flex;
justify-content: center;
min-height: 75vh; 
`;
const BuyerData = styled.div`
display: flex;
flex-direction: column;
width: 100%;

h1{
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  margin-top:20px;
  font-weight: bold;
}
h2{
  font-family: 'Montserrat', sans-serif;
  margin-top:5px;
  font-size: 18px;

}

`;

const ImageRaffle = styled.div`
display: flex;
width: 100%;
border-radius: 10px;
padding: 5px;

margin: 5px;
h3{
  font-size: 15px;
  margin-left: 10px;
}
`;

const Numbers = styled.div`
display: flex;
flex-wrap: wrap;
margin-top: 10px;

`;

const BoxNumber = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 20px;
width: 60px;
background: #f7aa74;
border: 1px solid #665c5c;
border-radius: 10px;
font-size: 16px;
margin-bottom: 10px;
margin-right: 7px;

padding: 2px;
box-sizing: border-box;


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
width: 450px;
border: 1px solid #e2e2e2;
border-radius: 10px;
padding: 20px;
margin: 10px;

display: flex;
flex-direction: column;

  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
const BackButton = styled.button`
  display: flex;
  justify-content:center;
  align-items: center;
  height: 35px;
  margin-top: 15px;
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