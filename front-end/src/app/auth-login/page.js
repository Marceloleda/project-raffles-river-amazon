'use client';

import { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { api, findUser, signIn } from "../../services/api";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Logo from '../../assets/images/logo_seler.jpeg';
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [login, setLogin] = useState({
        email: '',
        password_hash: ''
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            findUser()
                .then(() => {
                    router.push("/dashboard");
                })
                .catch((err) => {
                    localStorage.setItem("token", '');
                });
        }
    }, []);

    function enviarLogin(event) {
        event.preventDefault();

        signIn(login)
            .then((response) => {
                api.defaults.headers["Authorization"] = `Bearer ${response.data.Token}`;
                localStorage.setItem("token", response.data.Token);
                Swal.fire({
                    title: 'Logado com sucesso!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
                router.push("/dashboard");
            })
            .catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "E-mail e/ou senha incorreto(s)",
                });
                console.log(err.message);
            });
    }

    return (
        <Container>
            <SideLogin>
                <FormContainer>
                    <LogoWrapper>
                        <Image 
                            src={Logo}
                            alt="Logo"
                            width={150}
                            height={150}
                        />
                    </LogoWrapper>
                    <form onSubmit={enviarLogin}>
                        <FormTitle>Login</FormTitle>
                        <Input 
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={login.email}
                            onChange={(e) => setLogin({ ...login, email: e.target.value })}
                            required
                            autoComplete="username"
                        />
                        <Input
                            id="passwordInput"
                            type="password"
                            placeholder="Senha"
                            value={login.password_hash}
                            onChange={(e) => setLogin({ ...login, password_hash: e.target.value })}
                            required
                            autoComplete="current-password"
                        />
                        <ForgotPassword>
                            <Link href="/forgot-password" passHref>
                                <StyledLink>Esqueceu sua senha?</StyledLink>
                            </Link>
                        </ForgotPassword>
                        <Button type="submit">Entrar</Button>
                    </form>
                    <SignUp onClick={() => router.push("/sign-up")}>
                        Primeira vez? Cadastre-se!
                    </SignUp>
                </FormContainer>
            </SideLogin>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    height: 100vh;
    background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const SideLogin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    animation: fadeIn 1s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const FormContainer = styled.div`
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 90%;
    max-width: 400px;
`;

const LogoWrapper = styled.div`
    margin-bottom: 20px;
`;

const FormTitle = styled.h1`
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Input = styled.input`
    width: 100%;
    height: 58px;
    font-size: 18px;
    margin-bottom: 16px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease-in-out;

    &:focus {
        border-color: #84fab0;
        box-shadow: 0 0 5px rgba(132, 250, 176, 0.5);
    }
`;

const ForgotPassword = styled.div`
    margin-bottom: 20px;
`;

const StyledLink = styled.a`
    font-family: 'Montserrat', sans-serif;
    color: #007bff;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Button = styled.button`
    width: 100%;
    height: 50px;
    margin-bottom: 16px;
    background: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: white;
    transition: background 0.4s ease, transform 0.5s;

    &:hover {
        background: linear-gradient(90deg, #8fd3f4 0%, #84fab0 100%);
        transform: scale(1.05);

    }
`;

const SignUp = styled.div`
    margin-top: 25px;
    font-family: 'Montserrat', sans-serif;
    color: #333;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;
