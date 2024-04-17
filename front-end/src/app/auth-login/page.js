'use client'

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import styled from "styled-components";
import Swal from "sweetalert2";
import { api, findUser, signIn } from "../../services/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Logo from '../../assets/images/logo_seler.jpeg'
import Image from "next/image";



export default function Login(){
    const router = useRouter();
    const [login, setLogin] = useState({
        email: '',
        password_hash: ''
    })
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if(storedToken){
            findUser()
            .then(()=>{
              router.push("/dashboard")
          })
          .catch((err=>{
              localStorage.setItem("token", '')
          }))
        }
      }, []);

    function enviarLogin(event){
        event.preventDefault();

        signIn(login)
            .then((response)=>{
            api.defaults.headers["Authorization"] = `Bearer ${response.data.Token}`;
            localStorage.setItem("token", response.data.Token)
            Swal.fire({
                title: 'Logado com sucesso!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000 // Define o tempo em milissegundos antes de fechar automaticamente (opcional)
              });            
            router.push("/dashboard");
        })
            .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "E-mail e/ou senha incorreto(s)",
              });
            console.log(err.message)
        })
    }
    return(
        <Conteiner>
            <SideLogin>
                <Forms>
                    <LogoSide>
                        <Image src={Logo}
                            alt="Logo"
                            width={150} 
                            height={150} 
                        />
                    </LogoSide>
                    <form onSubmit={enviarLogin}>
                        <h1>Login</h1>
                        <Inserir  
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            value={login.email} 
                            onChange={(e) => setLogin({...login, email: e.target.value})} 
                            required 
                            autoComplete="username" // Adicionando o atributo autocomplete
                        />
                        <Inserir
                            id="passwordInput" // Alterado para um ID único
                            type="password"
                            placeholder="Senha"
                            value={login.password_hash}
                            onChange={(e) => setLogin({...login, password_hash: e.target.value})}
                            required
                            autoComplete="current-password" // Adicionado o atributo autocomplete
                        />
                        <EsqueceuSenha>
                            <a href={"/sign-up"} style={{ textDecoration: 'none' }}>
                                <h2>Esqueceu sua senha? Clique aqui</h2>
                                <br/>
                            </a>
                        </EsqueceuSenha>
                        <Botao type="submit">Entrar</Botao>
                        {/* <Botao2 type="submit">Entrar com sua conta Google</Botao2> */}
                    </form>
                        <Cadastro onClick={()=>router.push("/sign-up")}>
                            <h2>Primeira vez? Clique aqui e cadastre-se!</h2>
                        </Cadastro>
                </Forms>

            </SideLogin>
        </Conteiner>
    );
}
const Conteiner = styled.div`
    display: flex;
`;
const SideLogin = styled.div`
flex: 1;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
background: linear-gradient(to bottom, #b3d0f7 0%, #7aa9eb 50%, #b3d0f7 100%);
background-size: 100% 200%;
animation: riverFlow 10s linear infinite;
@keyframes riverFlow {
    0%, 100% {
        background-position: 0 0;
    }
    50% {
        background-position: 0 100%;
    }
}
`;
const LogoSide = styled.div`
flex: 1;
display: flex;
justify-content: center;
align-items: center;
margin-bottom:80px;

`;
const Forms = styled.div`
    form{
            display:flex;
            flex-direction:column;
            justify-content: center;
            align-items: center;
            h1{
                margin-bottom: 30px;
                font-family: 'Montserrat', sans-serif;
                font-size: 25px;
                color:black;
            }
        }
`;

const Inserir = styled.input`
    width:330px;
    height: 58px;
    font-size:18px;
    margin-bottom:16px;
    background: #FFFFFF;
    border: 1px solid #D5D5D5;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;

    &:first-child{
        margin-top: 25px;
    }
`;

const Botao = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 326px;
    height: 46px;
    margin-bottom:16px;
    
    background: #0bea91;
    border-radius: 15px;
    border:none;
    border: 3px solid #60d6a7;
    cursor: pointer;
    &:hover{
        background: #60d6a7;
    }
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    text-align: center;
    color: #012C42;
`;
const Botao2 = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 326px;
    height: 46px;
    margin-bottom:16px;

    background: blue;
    border-radius: 5px;
    border:none;
    cursor: pointer;
    font-family: 'Roboto';
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    text-align: center;
    color: #FFFFFF;
    font-family: 'Raleway';
`;

const EsqueceuSenha = styled.div`
    h2{
        font-family: 'Montserrat', sans-serif;
        color: #333333;
        font-size: 15px;
        font-weight: 400;
    }
`;

const Cadastro = styled.button`
    margin-top: 25px;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px;
    box-sizing: border-box;
    h2{
        font-family: 'Montserrat', sans-serif;
        color: #333333;
        font-size: 15px;
        font-weight: 700;
    }
`;