'use client'
import { styled } from "styled-components"
import { useRouter } from 'next/navigation';
import LogoSeller from '../../assets/images/logo_seler.jpeg'
import Image from "next/image";

//colocar a logo RA
export default function Sidebar({onFindCampaign, onHome}){
    const router = useRouter()

    const exit = ()=>{
        localStorage.setItem("token", '')
        alert("Desconectado")
        router.push("/")
    }
    return(
        <SidebarWrapper>
            
            <Titlle>
                <Image
                src={LogoSeller} 
                alt="Logo"
                width={60} 
                height={60} 
                />
                <p>Rifas Rio Amazonas</p>
            </Titlle>
            <User>
                <h2>
                    Bem vindo ao seu painel :)
                </h2>
            </User>
            <Option onClick={onHome}>Home</Option>
            <Option>Buscar ganhador</Option>
            <Option onClick={onFindCampaign}>Minhas Campanhas</Option>
            <Option>Minha Conta</Option>
            <Option>Suporte</Option>
            <ExitWrapper>
                <Exit onClick={(()=>{exit()})}>Sair da conta</Exit>                
            </ExitWrapper>

        </SidebarWrapper>
    )
}

const SidebarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  background: #c2efee;
  box-shadow: 2px 2px 5px rgba(1, 1, 1, 0.5);
  width: 250px;
  height: 100vh;
  left: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  border-top-right-radius: 15px; 
  border-bottom-right-radius: 15px; 

`;
const ExitWrapper = styled.div`
    margin-top: auto;
  margin-bottom: 0; /* Remove a margem inferior */
`;
const Titlle = styled.div`
display:flex;
margin-bottom: 60px;
justify-content: space-around;
width:100%px;
p{
    font-size: 30px;
    margin-left:10px;
}

`;

const Option = styled.div`
display:flex;
justify-content:center;
align-items: center;
margin-bottom: 10px;
height: 50px;
width:190px;
cursor: pointer;
&:hover {
    background-color: #ff847c;
}
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
border-radius: 15px;
border: 1px solid black;
`; 
const Exit = styled.div`
display:flex;
justify-content:center;
align-items: center;
height: 50px;
width:190px;
cursor: pointer;
margin-bottom:0px;
margin: auto;
background: red;
&:hover {
    background-color: #ff847c;
}
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
border-radius: 15px;
border: 1px solid black;
`;
const User = styled.div`
margin-bottom: 25px;
`;
