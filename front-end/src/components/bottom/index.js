import { styled } from "styled-components";
import Image from 'next/image';
import Logo from '../../assets/images/logo_seler.jpeg';

export default function Bottom() {
    return (
        <ContainerBottom>
            <Copyright>
                <h2>© 2024 - Todos os direitos reservados</h2>
            </Copyright>
            <h2>Rifas Beneficentes Rio Amazonas</h2>
            <LogoImage
                src={Logo}
                alt="Logo"
                width={50}
                height={50}
            />
        </ContainerBottom>
    );
}

const ContainerBottom = styled.div`
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #D6E5E3;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

    h2 {
        font-size: 15px;
        color: black;
        margin-bottom: 10px;
    }
`;

const Copyright = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    h2 {
        font-size: 13px;
        margin-right: 5px;
    }

    svg {
        color: #000;
    }
`;

const LogoImage = styled(Image)`
    margin-top: 10px;
`;
