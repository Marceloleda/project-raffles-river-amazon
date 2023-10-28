import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { PhotoService } from '../../services/PhotoService';
import { styled } from 'styled-components';

export default function PositionDemo() {
    const [images, setImages] = useState(null);
   
    
    useEffect(() => {
        PhotoService.getImages().then((data) => setImages(data));
    }, []);

    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    };

    return (
            <StyledCard>
                <Galleria value={images} style={{ maxWidth: '600px', minWidth: '315px' }} 
                showThumbnails={false} 
                showIndicators={false} 
                showIndicatorsOnItem={false} 
                indicatorsPosition={false} 
                item={itemTemplate} 
                circular autoPlay transitionInterval={4000} 
                />
            </StyledCard>
    )
}
        

const StyledCard = styled.div`
border-radius: 15px;
`;