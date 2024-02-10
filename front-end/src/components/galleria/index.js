import React, { useState, useEffect, useRef } from 'react';
import { Galleria } from 'primereact/galleria';
import { PhotoService } from '../../services/PhotoService';
import { styled } from 'styled-components';
import Prizes from "../../assets/images/prizes.jpeg"
import Image from 'next/image';

export default function GalleriaRaffles() {
    const [images, setImages] = useState(null);
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
    const [imagesPrizes, setImagesPrizes] = useState([
        {
            thumbnailImageSrc: "../../assets/images/prizes.jpeg",
            alt: 'Description for Image 1',
            title: 'Title 1'
        }
    ]);
    useEffect(() => {
        PhotoService.getImages().then((data) => setImages(data));

        const handleScroll = () => {
            setIsAutoPlayEnabled(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);

        // Limpeza do evento de rolagem ao desmontar o componente
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Dependências vazias para garantir que o efeito seja executado apenas uma vez

    const Scroll = ()=> {
        return (
            <Galleria value={images} style={{ maxWidth: '600px', minWidth: '315px'}}
            showThumbnails={false} 
            showIndicators={false} 
            showIndicatorsOnItem={false} 
            indicatorsPosition={false} 
            item={itemTemplate} 
            circular 
            autoPlay={isAutoPlayEnabled}
            transitionInterval={4000} 
            />
        )
    }
    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', height: "100%"}} loading="lazy"/>;
    };
    const itemPrize = (item) => {
        return <Image src={Prizes} alt={item.alt} style={{ width: '100%', height: "100%"}} />;
    };

    return (
        <StyledCard>
            {images?.length === 0 || images === undefined || images === null?
                <Galleria value={imagesPrizes} style={{ maxWidth: '600px', minWidth: '315px'}}
                showThumbnails={false} 
                showIndicators={false} 
                showIndicatorsOnItem={false} 
                indicatorsPosition={false} 
                item={itemPrize} 
                circular 
                />
                :
                <Galleria value={imagesPrizes} style={{ maxWidth: '600px', minWidth: '315px'}}
                showThumbnails={false} 
                showIndicators={false} 
                showIndicatorsOnItem={false} 
                indicatorsPosition={false} 
                item={itemPrize} 
                circular 
                />
                // <Scroll/> 
            }             
        </StyledCard>

    )
}

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  border-radius: 15px;
  overflow: hidden;  // Impede que as imagens ultrapassem os limites do contêiner
  height: 400px;  // Defina o tamanho desejado

`;

