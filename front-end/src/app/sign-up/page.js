'use client'
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { findUser, signUpSend } from "../../services/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import LogoRio from "../../assets/images/logo_main.png"
import Image from "next/image";
import { IMaskInput } from "react-imask";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

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
            router.push("/dashboard")
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
            <Image
               src={LogoRio} 
               alt="Logo"
               width={195} 
               height={195} 
            />            
            <h1>Rifas Rio Amazonas</h1>
            <h2>Preencha os dados abaixo</h2>
                <Forms>
                    <FormGroup>

                        <form onSubmit={Cadastro}>
                            <Inserir 
                                id="name" 
                                placeholder="Nome" 
                                value={cadastro.name} 
                                onChange={(e)=>
                                setCadastro({...cadastro, name: e.target.value})
                                }
                                required
                            />
                            <Inserir 
                                id="email" 
                                type="email" 
                                placeholder="Email" 
                                value={cadastro.email} 
                                onChange={(e)=>
                                setCadastro({...cadastro, email: e.target.value})
                                }
                                autoComplete="current-email" // Adicionado o atributo autocomplete
                                required
                            />
                            <Inserir 
                                id="phone_number" 
                                type="phone" 
                                placeholder="(99) 99999-9999" 
                                mask="(#0) 00000-0000"
                                definitions={{
                                '#': /[1-9]/,
                                }}
                                value={cadastro.phone_number} 
                                onChange={(e)=>
                                setCadastro({...cadastro, phone_number: e.target.value})
                                }
                                onAccept={(value) => setCadastro({ ...cadastro, phone_number: value })}
                                required
                            />
                            <Inserir 
                                id="cpf" 
                                mask="000.000.000-00"
                                type="CPF" 
                                placeholder="CPF" 
                                value={cadastro.cpf} 
                                onChange={(e)=>
                                setCadastro({...cadastro, cpf: e.target.value})
                                }
                                onAccept={(value) => setCadastro({ ...cadastro, cpf: value })}

                            />
                            <Inserir 
                                id="password" 
                                type="password" 
                                placeholder="Senha" 
                                value={cadastro.senha} 
                                onChange={(e)=>
                                setCadastro({...cadastro, senha: e.target.value})
                                }
                                autoComplete="current-password" // Adicionado o atributo autocomplete
                                required
                            />
                            <Inserir 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirme a senha" 
                                value={cadastro.confirmeSenha} 
                                onChange={(e)=>
                                setCadastro({...cadastro, confirmeSenha: e.target.value})
                                }
                                autoComplete="confirm-password" // Adicionado o atributo autocomplete
                                required
                            />

                            {passwordError && (
                            <ErrorMessage>
                                {cadastro.senha?.length < 8
                                ? "A senha deve ter pelo menos 8 caracteres."
                                : "As senhas não conferem! Coloque as senhas iguais ;-)"}
                            </ErrorMessage>
                            )}
                            <Termos>
                                <FormControlLabel required control={<Checkbox/>} label="Concordo com os seguintes termos" />
                                <a href="./TermosdeServico.pdf" target="_blank">Termos Rifas Rio Amazonas</a>
                            </Termos>


                            <Botao type="submit">Cadastrar</Botao>

                        </form>
                    </FormGroup>
                </Forms>

                <Entrar onClick={()=>router.push("/auth-login")}>
                        <h3>Já tem uma conta? Entre agora!</h3>
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
    height: 100%;
    h1{
        font-family: 'Montserrat', sans-serif;
        font-size: 38px;
        color: #333333;
    }
    h2{
        font-family: 'Montserrat', sans-serif;
        font-size: 24px;
        color: #333333;
        margin-top: 25px;
    }
    margin: 0;
    width: 100%;
`;


const Termos = styled.div`
    display:flex;

`
const Forms = styled.div`
    form{
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
    }
`
const Inserir = styled(IMaskInput)`
    width: 326px;
    height: 58px;
    margin-bottom: 16px;
    background: #FFFFFF;
    border: 1px solid #D5D5D5;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;


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
    background: #0bea91;
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
    &:hover{
        background: #419A77;
    }
    border: 2px solid #419A77 ;

`;
const Entrar = styled.button`

    margin-top: 35px;
    margin-bottom: 55px;
    border-radius: 5px;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
    h3{
        font-family: 'Montserrat', sans-serif;
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
