"use client"

import { styled } from "styled-components"
import Image from 'next/image';
import Logo from '../../assets/images/logo_main.png'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header(){
    const [token, setToken] = useState(null);
  
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
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
    h1{
        font-family: 'Nunito', sans-serif;
        font-size: 40px; 
    }
    h2{
        font-size: 25px; 
        color: black; 
    }

`;