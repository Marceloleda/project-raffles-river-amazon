'use client'
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { findUser, signUpSend } from "../../services/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import LogoRio from "../../assets/images/logo_main.png"
import Image from "next/image";
import { IMaskInput } from "react-imask";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export default function Cadastro(){
    const router = useRouter();
    const [cadastro, setCadastro] = useState({
        name: '',
        email: '',
        phone_number:'',
        cpf:'',
        senha: '',
        confirmeSenha: ''
    });
    const [passwordError, setPasswordError] = useState(false);
  
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if(storedToken){
          findUser()
          .then(()=>{
            router.push("/dashboard")
        })
        .catch((err)=>{
            localStorage.setItem("token", '')
        })
      }
    }, []);

    function Cadastro(event){
        event.preventDefault();

        const {senha, confirmeSenha} = cadastro;

        if(senha === confirmeSenha){
            if (senha.length < 8) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
                const signUp = {
                    name: cadastro.name,
                    email: cadastro.email,
                    phone_number: cadastro.phone_number,
                    cpf: cadastro.cpf,
                    password_hash: cadastro.senha
                }
                signUpSend(signUp)
                .then(() => {
                    Swal.fire('Cadastrado com sucesso!', '', 'success');
                    router.push('/auth-login');
                })
                .catch((err) => {
                    if (err.message === "Request failed with status code 409") {
                        Swal.fire('Você já está cadastrado', '', 'error');
                    }
                    if (err.message === "Request failed with status code 422") {
                        Swal.fire('Verifique se seus dados foram digitados corretamente', '', 'error');
                    }
                    if (err.message === "Network Error") {
                        Swal.fire('Erro de conexão, tente novamente mais tarde', '', 'error');
                    }
                    console.log(err.message);
                });
            }
        } else {
            setPasswordError(true);
        }
    }
    
    return(
        <>
            <Container>
                <LogoWrapper>
                    <Image
                       src={LogoRio} 
                       alt="Logo"
                       width={150} 
                       height={150} 
                    />
                </LogoWrapper>
                <Title>Rifas Rio Amazonas</Title>
                <Subtitle>Preencha os dados abaixo</Subtitle>
                <FormWrapper>
                    <FormGroup>
                        <Form onSubmit={Cadastro}>
                            <Input 
                                id="name" 
                                placeholder="Nome" 
                                value={cadastro.name} 
                                onChange={(e) => setCadastro({...cadastro, name: e.target.value})}
                                required
                            />
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Email" 
                                value={cadastro.email} 
                                onChange={(e) => setCadastro({...cadastro, email: e.target.value})}
                                autoComplete="current-email"
                                required
                            />
                            <Input 
                                id="phone_number" 
                                type="phone" 
                                placeholder="(99) 99999-9999" 
                                mask="(#0) 00000-0000"
                                definitions={{ '#': /[1-9]/ }}
                                value={cadastro.phone_number} 
                                onChange={(e) => setCadastro({...cadastro, phone_number: e.target.value})}
                                onAccept={(value) => setCadastro({ ...cadastro, phone_number: value })}
                                required
                            />
                            <Input 
                                id="cpf" 
                                mask="000.000.000-00"
                                type="CPF" 
                                placeholder="CPF" 
                                value={cadastro.cpf} 
                                onChange={(e) => setCadastro({...cadastro, cpf: e.target.value})}
                                onAccept={(value) => setCadastro({ ...cadastro, cpf: value })}
                                required
                            />
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Senha" 
                                value={cadastro.senha} 
                                onChange={(e) => setCadastro({...cadastro, senha: e.target.value})}
                                autoComplete="current-password"
                                required
                            />
                            <Input 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirme a senha" 
                                value={cadastro.confirmeSenha} 
                                onChange={(e) => setCadastro({...cadastro, confirmeSenha: e.target.value})}
                                autoComplete="confirm-password"
                                required
                            />

                            {passwordError && (
                            <ErrorMessage>
                                {cadastro.senha?.length < 8
                                ? "A senha deve ter pelo menos 8 caracteres."
                                : "As senhas não conferem! Coloque as senhas iguais ;-)"}
                            </ErrorMessage>
                            )}
                            <Terms>
                                <FormControlLabel required control={<Checkbox/>} label="Concordo com os seguintes termos" />
                                <TermsLink href="./TermosdeServico.pdf" target="_blank">Termos Rifas Rio Amazonas</TermsLink>
                            </Terms>

                            <Button type="submit">Cadastrar</Button>
                        </Form>
                    </FormGroup>
                </FormWrapper>

                <LoginLink onClick={()=>router.push("/auth-login")}>
                        <LoginText>Já tem uma conta? Entre agora!</LoginText>
                </LoginLink>
            </Container>
        </>
    );
}

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
    font-family: 'Raleway', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #74EBD5 0%, #ACB6E5 100%);
    min-height: 100vh;
    color: #333;
`;

const LogoWrapper = styled.div`
    margin-top: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    
    &:hover {
        transform: scale(1.1);
    }
`;

const Title = styled.h1`
    font-family: 'Montserrat', sans-serif;
    font-size: 38px;
    color: #fff;
    margin-top: 20px;
`;

const Subtitle = styled.h2`
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    color: #fff;
    margin-top: 10px;
`;

const FormWrapper = styled.div`
    width: 100%;
    max-width: 400px;
    margin-top: 20px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    border-radius: 20px;
    animation: ${fadeIn} 0.5s ease-in-out;

    @media (max-width: 600px) {
        padding: 20px;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled(IMaskInput)`
    width: 100%;
    height: 50px;
    margin-bottom: 16px;
    padding: 0 15px;
    background: #F5F5F5;
    border: 2px solid #D5D5D5;
    border-radius: 15px;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    transition: background 0.3s ease, border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #74EBD5;
        background: #E3F2FD;
    }

    @media (max-width: 600px) {
        height: 40px;
        font-size: 14px;
    }
`;

const Button = styled.button`
    width: 100%;
    height: 50px;
    margin-top: 10px;
    background: #74EBD5;
    border: none;
    border-radius: 15px;
    font-family: 'Raleway', sans-serif;
    font-size: 18px;
    color: #FFF;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s;

    &:hover {
        background: #ACB6E5;
        transform: scale(1.05);
    }

    @media (max-width: 600px) {
        height: 40px;
        font-size: 16px;
    }
`;

const LoginLink = styled.div`
    margin-top: 20px;
    cursor: pointer;
`;

const LoginText = styled.h3`
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    font-size: 18px;
    font-weight: 700;

    @media (max-width: 600px) {
        font-size: 16px;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;

    @media (max-width: 600px) {
        font-size: 12px;
    }
`;

const Terms = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const TermsLink = styled.a`
    color: #74EBD5;
    margin-left: 5px;
    text-decoration: underline;

    &:hover {
        color: #ACB6E5;
    }

    @media (max-width: 600px) {
        margin-left: 0;
        margin-top: 5px;
    }
`;
