'use client'

import { styled } from 'styled-components'
import Header from '../components/header/index'
import Plans from '../components/plans/index'

export default function Home() {
  return (
    <>
      <Header/>
      <Conteiner>
        <Description>
          <h1>Seja um Vendedor de Rifas Beneficentes!<br/> </h1>
          <h2>
          Nossa plataforma oferece a oportunidade de vender rifas beneficentes e arrecadar fundos para organizações e projetos sociais.
          <br/>
            Com os nossos planos exclusivos, você terá todo o suporte necessário para alcançar suas metas e criar experiências memoráveis. <br/>
          </h2>
          <h3>
          Junte-se a nós e seja um agente de mudança em sua comunidade. <br/>Cadastre-se como vendedor de rifas beneficentes agora mesmo e comece a fazer a diferença!
          </h3>
          <br/>
          <h2>É fácil começar! Basta se cadastrar como vendedor em nosso site e receber seu próprio <br/>link personalizado para compartilhar com sua rede de contatos. 
        <br/>Compartilhe nas redes sociais, envie para amigos e familiares, e até mesmo aborde estabelecimentos locais para oferecer as rifas.</h2>
        </Description>
        <Plans/>
      </Conteiner>
    </>
  )
}
const Conteiner = styled.div`
display: flex;
flex-direction: column;
min-height: 100vh;
align-items: center;
padding-top: 80px; 
`;

const Description = styled.div`
display: flex;
flex-direction: column;
margin-top: 40px;
text-align:center;
  h1{
    color: #333333;
    font-family: 'Open Sans', sans-serif;
    font-size: 25px; 
    margin-bottom: 40px;
  }
  h2{
    font-family: 'Nunito', sans-serif;
    margin-bottom: 25px;
    color: #333333;
  }
  h3{
    font-family: 'Nunito', sans-serif;
    color: #333333;
  }


`;
