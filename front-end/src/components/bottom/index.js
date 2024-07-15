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
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
    border-top: 3px solid #2ecc71;
    text-align: center;

    h2 {
        font-size: 16px;
        color: #333;
        margin: 10px 0;
    }
`;

const Copyright = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    h2 {
        font-size: 14px;
        color: #666;
        margin-right: 5px;
    }
`;

const LogoImage = styled(Image)`
    margin-top: 15px;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
