'use client'
import Logo from '../../../../assets/images/logo_main.png'
import Image from 'next/image';
import { useState } from 'react';
import { styled } from 'styled-components';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ShareIcon from '@mui/icons-material/Share';
import Raffle from '../../../../components/buyerRaffle/index';
import FindTickets from '../../../../components/findTickets/index';
import Bottom from '../../../../components/bottom';



export default function RafflePagePrincipal({ params, searchParams }) {
  const [showFindPurchase, setShowFindPurchase] = useState(false);
  const [showRaffle, setShowRaffle] = useState(true);

  const [state, setState] = useState({
    right: false,
  });


  const handleFindTickets = () => {
    setShowRaffle(false)
    setShowFindPurchase(true);
  };

  const handleBackRaffle = () => {
    setShowRaffle(true);
    setShowFindPurchase(false);
  };

  const handleRaffle = () => {
    setShowRaffle(true);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    // 'Compartilhe e ganhe!'
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Meus Bilhetes'].map((text, index) => (
          <ListItem key={text} >
            <ListItemButton onClick={()=> {
                if(text === 'Meus Bilhetes'){
                  handleFindTickets()
                }
              }}>
              <ListItemIcon>
                {index % 2 === 0 ? <LocalActivityIcon /> : <ShareIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Suporte'].map((text, index) => (
          <ListItem key={text} >
            <ListItemButton onClick={()=>{
              window.open(
                `https://api.whatsapp.com/send?phone=5592995074770&text=Ol%C3%A1.%20Preciso%20de%20suporte%20com%20uma%20Rifa,%20aguardo%20mais%20informa%C3%A7%C3%B5es.
                Rifa:%20https:www.rifasrioamazonas.com.br/${params.id}/${params.slug}`,
                '_blank'
              );
            }}>
              <ListItemIcon>
                {index % 2 === 0 ? <MailIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
        <>
          <ResponsiveConteinerHeader>
            <Image
               src={Logo} 
               alt="Logo"
               width={70} 
               height={70}
               style={{marginRight: "60px"}} 
            />
            <h1>Rifas Rio<br/> Amazonas</h1>
            
            <ResponsiveMenuHeader >
                  <MenuIcon fontSize='large' onClick={toggleDrawer('right', true)}/>
                  <SwipeableDrawer
                    anchor={'right'}
                    open={state['right']}
                    onClose={toggleDrawer('right', false)}
                    onOpen={toggleDrawer('right', true)}
                  >
                    {list('right')}
                  </SwipeableDrawer>
              </ResponsiveMenuHeader>
          </ResponsiveConteinerHeader>
          {showFindPurchase && <FindTickets onHandleBackRaffle={handleBackRaffle}/>}
          {showRaffle && <Raffle  params={params} searchParams={searchParams}/>}
          <Bottom/>
        </>
  );
}

const MenuHeader = styled.div`
  display: flex;
  height: 35px;
  width: 35px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  animation: fade-in 0.5s ease-in-out forwards;
  animation-delay: 1ms;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
  &:hover{
    box-shadow: 0 1px 4px rgba(5, 5, 5, 1.5); 
  }

`;
const ResponsiveMenuHeader = styled(MenuHeader)`
@media (max-width: 460px) {
  height: 30px;
  width: 30px;
  border-radius: 0%;
  animation: fade-in 0s ease-in-out forwards;
  animation-delay: 0ms;
  transition: box-shadow 0s ease;
  &:hover{
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0); 

  }

}
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

const ResponsiveConteinerHeader = styled(ConteinerHeader)`
  @media (max-width: 900px) {
    h1 {
      font-size: 22px;
      margin-right: 10px;
    }

    h2 {
      font-size: 18px;
    }

    img {
      width: 60px; /* Ajuste o tamanho conforme necessário */
      height: 60px; /* Ajuste o tamanho conforme necessário */
      margin-right: 10px;
    }
  }

  @media (max-width: 315px) {
    width: 315px;

  }
`;

// const SpinnerContainer = styled.div`
//     display: flex;
//     justify-content: center;
//     background: #f2f2f2;
//     align-items: center;
//     min-height: 100vh; 
// `;
// const StyledSpinner = styled.div`
//   width: 50px;
//   height: 50px;
//   border: 5px solid #f3f3f3;
//   border-top: 5px solid purple;
//   border-radius: 50%;
//   animation: spin 1s linear infinite;

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;


