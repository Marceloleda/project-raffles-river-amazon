'use client';

import { styled } from "styled-components";
import Image from 'next/image';
import Logo from '../../assets/images/logo_main.png';
import Link from "next/link";
import { useEffect, useState } from "react";
import { findUser } from "../../services/api";
import LoginPng from "../../assets/images/login.png";

export default function Header() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            findUser()
                .then(() => {
                    setToken(storedToken);
                })
                .catch((err) => {
                    localStorage.setItem("token", '');
                    console.log(err.message);
                });
        }
    }, []);

    return (
        <ResponsiveContainerHeader>
            <LogoContainer>
                <Image
                    src={Logo}
                    alt="Logo"
                    width={77}
                    height={77}
                    quality={100}
                />
                <Title>Rifas Rio Amazonas</Title>
            </LogoContainer>
            <Nav>
                {token ?
                    <StyledLink href="/dashboard" passHref>
                        <Button>
                            <ButtonText>Meu Painel</ButtonText>
                        </Button>
                    </StyledLink>
                    :
                    <StyledLink href="/auth-login" passHref>
                        <Button>
                            <Image
                                src={LoginPng}
                                alt="Login"
                                width={30}
                                height={30}
                                style={{ marginRight: "9px" }}
                                quality={100}
                            />
                            <ButtonText>Login</ButtonText>
                        </Button>
                    </StyledLink>
                }
            </Nav>
        </ResponsiveContainerHeader>
    );
}

const ContainerHeader = styled.div`
    position: fixed;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    width: 100%;
    padding: 15px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Montserrat', sans-serif;
    z-index: 10;
    box-sizing: border-box;
`;

const ResponsiveContainerHeader = styled(ContainerHeader)`
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 10px;
    align-items: center;
  }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin-left: 15px;
    @media (max-width: 900px) {
        font-size: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 15px;
    @media (max-width: 900px) {
        width: 100%;
        justify-content: center;
        margin-top: 10px;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 9px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }

    @media (max-width: 900px) {
        width: auto;
        margin-top: 10px;
    }
`;

const ButtonText = styled.span`
    font-size: 18px;
    color: #333;
    margin-left: 8px;

    @media (max-width: 900px) {
        font-size: 16px;
        margin-left: 6px;
    }
`;
