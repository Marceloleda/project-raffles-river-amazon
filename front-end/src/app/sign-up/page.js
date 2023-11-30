'use client'
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { findUser, signUpSend } from "../../services/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Cadastro(){
    const router = useRouter()
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
            router.push("/seller")
        })
        .catch((err=>{
            localStorage.setItem("token", '')
        }))
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
          .then((res) => {
            Swal.fire('Cadastrado com sucesso!', '', 'success');
            router.push('/auth-login')
          })
          .catch((err) => {
            if (err.message === "Request failed with status code 409") {
              Swal.fire('Voce ja esta cadastrado', '', 'error');
            }
            if (err.message === "Request failed with status code 422") {
              Swal.fire('Verifique se seus dados foram digitados corretamente', '', 'error');
            }
            if (err.message === "Network Error") {
              Swal.fire('Erro de conexao, tente novamente mais tarde', '', 'error');
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
            <Conteiner>
                <h1>Rifas Rio Amazonas</h1>
                <Forms>
                    <form onSubmit={Cadastro}>
                        <Inserir id="name" placeholder="Nome" value={cadastro.name} onChange={(e)=>
                        setCadastro({...cadastro, name: e.target.value})
                        }/>
                        <Inserir id="email" type="email" placeholder="Email" value={cadastro.email} onChange={(e)=>
                        setCadastro({...cadastro, email: e.target.value})
                        }/>
                        <Inserir id="phone_number" type="phone" placeholder="celular" value={cadastro.phone_number} onChange={(e)=>
                        setCadastro({...cadastro, phone_number: e.target.value})
                        }/>
                        <Inserir id="cpf" type="cpf" placeholder="cpf" value={cadastro.cpf} onChange={(e)=>
                        setCadastro({...cadastro, cpf: e.target.value})
                        }/>
                        <Inserir id="password" type="password" placeholder="Senha" value={cadastro.senha} onChange={(e)=>
                        setCadastro({...cadastro, senha: e.target.value})
                        }/>
                        <Inserir id="confirmPassword" type="password" placeholder="Confirme a senha" value={cadastro.confirmeSenha} onChange={(e)=>
                        setCadastro({...cadastro, confirmeSenha: e.target.value})
                        }/>

                        {passwordError && (
                        <ErrorMessage>
                            {cadastro.senha?.length < 8
                            ? "A senha deve ter pelo menos 8 caracteres."
                            : "As senhas não conferem! Coloque as senhas iguais ;-)"}
                        </ErrorMessage>
                        )}

                        <Botao type="submit">Cadastar</Botao>
                    </form>
                </Forms>

                <Entrar>
                    <Link href={`/auth-login`} style={{ textDecoration: 'none' }}>
                        <h2>Já tem uma conta? Entre agora!</h2>
                    </Link>
                </Entrar>
            </Conteiner>
        </>
    );
}

const Conteiner = styled.div`
    font-family: 'Raleway';
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    h1{
        font-family: 'Raleway', sans-serif;
        font-size: 32px;
        color: #333333;
    }
    margin: 0;
    overflow: hidden;
    height: 100vh;
    width: 100%;
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

const Forms = styled.div`
    form{
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
    }
`
const Inserir = styled.input`
    width: 326px;
    height: 58px;
    margin-bottom: 16px;
    background: #FFFFFF;
    border: 1px solid #D5D5D5;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
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
    background: green;
    border-radius: 15px;
    border:none;
    cursor: pointer;
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    color: #FFFFFF;
    font-family: 'Raleway', sans-serif;
`;
const Entrar = styled.div`
    margin-top: 35px;
    h2{
        font-family: 'Raleway', sans-serif;
        color: #333333;
        font-size: 20px;
        font-weight: 700;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
`;
