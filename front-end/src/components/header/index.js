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
        <ConteinerHeader>
            <Image
               src={Logo} 
               alt="Logo"
               width={75} 
               height={75} 
            />
            <h1>Rifas Rio Amazonas</h1>
                {token? 
                <Link href="/seller" style={{ textDecoration: 'none' }}><h2>Meu Painel</h2></Link> :

                <Link href="/auth-login" style={{ textDecoration: 'none' }}>
                    <Image
                        src={LoginPng} 
                        alt="Logo"
                        width={55} 
                        height={55} 
                    />
                    <h2>Login</h2>
                </Link>
                }
        </ConteinerHeader>
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
        margin-left:-5px;
    }

`;