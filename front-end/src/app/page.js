'use client';

import { styled } from 'styled-components';
import Header from '../components/header/index';
import Plans from '../components/plans/index';
import Bottom from '../components/bottom/index';

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <Description>
          <h1>Seja um Vendedor de Rifas Beneficentes!</h1>
          <h2>
            Nossa plataforma oferece a oportunidade de vender rifas beneficentes e arrecadar fundos para organizações e projetos sociais.
          </h2>
          <h3>
            Cadastre-se como vendedor de rifas beneficentes agora mesmo e comece a fazer a diferença!
          </h3>
        </Description>
        <Plans />
      </Container>
      <Bottom />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  min-height: 100vh;
  text-align: center;
`;

const Description = styled.div`
  margin-top: 60px;
  max-width: 800px;
  padding: 0 20px;
  color: #333;

  h1, h2, h3 {
    font-family: 'Montserrat', sans-serif;
    color: #333;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #ffcc80);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: 500;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 400;
  }
`;
