"use client"

import { styled } from "styled-components"
import Image from 'next/image';
import Logo from '../../assets/images/logo_main.png'
import Link from "next/link";
import { useEffect, useState } from "react";
import { findUser } from "../../services/api";
import LoginPng from "../../assets/images/login.png"

export default function Header(){
    const [token, setToken] = useState(null);
  
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if(storedToken){
          findUser()
          .then(()=>{
            setToken(storedToken);
        })
        .catch((err=>{
            localStorage.setItem("token", '')
            console.log(err.message)
        }))
      }
    }, []);
    return (
        <ResponsiveConteinerHeader>
            <Image
               src={Logo} 
               alt="Logo"
               width={75} 
               height={75} 
            />
            <h1>Rifas Rio Amazonas</h1>
                {token? 
                <Link href="/dashboard" style={{ textDecoration: 'none' }}><h2>Meu Painel</h2></Link> 
                :
                <Link href="/auth-login" style={{ textDecoration: 'none' }}>
                  <Login>
                          <Image
                              src={LoginPng} 
                              alt="Logo"
                              width={45} 
                              height={45} 
                              style={{marginRight: "9px"}}
                          />
                          <h2>Login</h2>
                  </Login>
                </Link>
                }
        </ResponsiveConteinerHeader>
    )
}

const ConteinerHeader = styled.div`
    position: fixed;
    background-color: #D6E5E3; 
    box-sizing: border-box;
    width: 100%;
    padding: 15px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    font-family: 'Montserrat', sans-serif;


    h1{
        font-size: 40px; 
        font-weight: bold;
    }
    h2{
        font-size: 25px; 
        color: black; 
    }

`;

const ResponsiveConteinerHeader = styled(ConteinerHeader)`
  @media (max-width: 900px) {
    h1{
      font-size: 20px; 
      font-weight: bold;
    }
  }
`;

const Login = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 95px;
height:95px;
opacity: 0;
animation: fade-in 0.5s ease-in-out forwards;
animation-delay: 1ms;
transition: box-shadow 0.3s ease;
border-radius: 30px;
&:hover {
  box-shadow: 0 4px 9px rgba(5, 5, 5, 1.5); /* Aumenta a sombra quando o mouse está sobre a div */
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