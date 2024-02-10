'use client'

import Image from "next/image";
import styled from "styled-components";
import { IMaskInput } from 'react-imask';
import { useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import Logopix from "../../assets/images/pixLogo.png";
import LogoMP from "../../assets/images/mercado-pago.png";

import { Alert, Box, LinearProgress, Snackbar } from '@mui/material';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import SuccessPayment from "../../components/animationPaymentSuccess/index";
import { cancelPayment } from "../../services/api";



export default function DataPaymentBuyer({onDataMecadopago, searchParams, setSchrollModel}){
  const socket = io(process.env.NEXT_PUBLIC_API_URL);
    const qrCodeValue = onDataMecadopago?.point_of_interaction?.transaction_data?.qr_code;
    const router =useRouter()
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [open, setOpen] = useState(false);
    const [statusPayment, setStatusPayment] = useState(false);
    const [isCopied, setIsCopied] = useState(false); 
    const scrollRef = useRef(null); // Referência para o elemento a ser rolado
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showCopySuccessSnackbar = () => {
      setOpen(true);
    };

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [])

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const CopyToClipboardButton = memo(({ textToCopy, isCopied, onCopy, showCopySuccessSnackbar }) => {
      useEffect(() => {
        const expirationDate = new Date(onDataMecadopago.date_of_expiration);
        const timer = setInterval(() => {
          const newTimeDifference = expirationDate - new Date();
          if (newTimeDifference <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Oops...",
              text: "Esta compra expirou! Tente novamente.",
            });
            router.back();
            clearInterval(timer);
          } else {
            setTimeRemaining(newTimeDifference);
          }
        }, 1000);

        socket.on('payment_ticket', (idPayment) => {
          if (idPayment === String(onDataMecadopago.id)) {
            setStatusPayment(true);
          }
        });
      
        return () => {
          clearInterval(timer);
          socket.off('payment_ticket');
        }
      }, [timeRemaining]); // Adiciona timeRemaining como dependência
      
        const handleCopyClick = () => {
          navigator.clipboard.writeText(textToCopy);
          onCopy(true);
          showCopySuccessSnackbar();
      
          // Reset the "Copied" state after a short delay
          setTimeout(() => {
            onCopy(false);
          }, 1900);
        };
      
        return (
          <CopyButtonStyled onClick={handleCopyClick} $copied={isCopied}>
            {isCopied ? 'Copiado!' : 'Copiar'}
          </CopyButtonStyled>
        );
      });

      const formatTimeRemaining = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        // const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      
        return `${minutes}m ${seconds}s`;
      };

      const calculateProgress = (timeRemaining) => {
        if (timeRemaining <= 0) {
          return 100; // Se o tempo restante for menor ou igual a 0, retorna 100 para indicar conclusão
        }
        
        const totalTime = 7 * 60 * 1000; // 15 minutos em milissegundos
        const elapsedTime = timeRemaining; // Tempo decorrido em milissegundos
        
        const progress = Math.min(100, (elapsedTime / totalTime) * 100);
        const roundedProgress = Number(progress.toFixed(1)); // Limita para uma casa decimal
        return roundedProgress;
      };


      // if (scrollRef.current) {
      //   window.scrollTo({
      //     top: scrollRef.current.offsetTop,
      //     behavior: 'smooth', // Adiciona uma animação de rolagem suave
      //   });
      // }

      return (
        <ModalContent ref={scrollRef}>  
            {statusPayment?
              <SuccessPayment onDataMercadoPagoBuyer={onDataMecadopago} setModelSchroll={setSchrollModel}/>
              :
              <>
                <h1>Finalize o pagamento</h1>
                    <Contador>
                        <h2>Tempo restante: {formatTimeRemaining(timeRemaining)}</h2>
                        <Box sx={{ flexGrow: 1 }}>
                          <br />
                          <LinearProgress 
                          variant="determinate" 
                          value={Math.round(calculateProgress(timeRemaining))}
                          style={{height: "10px", borderRadius: "5px"}}/>
                        </Box>
                    </Contador>
                <QrCode>
                    <img src={`data:image/jpeg;base64,${onDataMecadopago.point_of_interaction.transaction_data.qr_code_base64}`} alt="QR Code" style={{width: "250px"}}/>
                </QrCode>
                <label htmlFor="copiar">Copiar Pix:</label>
                <CopyContainer>
                    <CopyInput type="text" id="copiar" value={qrCodeValue} readOnly />
                      <CopyToClipboardButton textToCopy={qrCodeValue} isCopied={isCopied} onCopy={setIsCopied} showCopySuccessSnackbar={showCopySuccessSnackbar} />            
                    </CopyContainer>
                <DadosPagamento>
                    <h1>Detalhes da compra:</h1>
                    <div>
                      <Dados><h2>Registro:</h2> <p>{onDataMecadopago.id}</p></Dados>
                      <Dados><h2>Descrição:</h2> <p>{onDataMecadopago.description}</p></Dados>
                      <Dados><h2>Forma de pagamento:</h2> <p>{onDataMecadopago.payment_method_id}</p></Dados>
                      <Dados><h2>Total:</h2><p>R$ {onDataMecadopago.transaction_amount}</p></Dados>
                    </div>
                    
                    <h1>Forma de pagamento:</h1>
                    <Image
                      src={Logopix} 
                      alt="pix"
                      // width={210} 
                      height={55} 
                      style={{ marginBottom: '25px' }}
                    />
                    <Image
                      src={LogoMP} 
                      alt="pix"
                      // width={500} 
                      height={40} 
                      style={{ marginBottom: '35px', marginLeft: '15px' }}
                    />

                    <Snackbar 
                    open={open} 
                    autoHideDuration={1800} 
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Copiado para a área de transferência!                    
                        </Alert>
                    </Snackbar>
                </DadosPagamento>
                <div>
                    <ModalButton 
                    onClick={()=>{
                      Swal.fire({
                        title: "Você tem certeza?",
                        text: "Você irá cancelar esta compra.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        cancelButtonText: "Voltar",
                        confirmButtonText: "Sim, desejo cancelar."
                      }).then((result) => {
                        if (result.isConfirmed) {
                          cancelPayment(onDataMecadopago.id)
                            .then((res) => {                              
                            })
                            .catch((err) => {
                              console.log(err.message);
                            });
                          Swal.fire({
                            title: "Cancelada!",
                            text: "A compra foi cancelada.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                          });
                          setSchrollModel(false)
                          router.back()
                        }
                      });
                    }} 
                    $isloading={isLoading} 
                    disabled={isLoading} 
                    >
                      Voltar
                    </ModalButton>
                </div>
              </>
            }          
        </ModalContent>
    );
}

const Contador = styled.div`
margin-top:7px;
  h2{
    font-size: 18px;
    font-family: 'Montserrat', sans-serif;
}
`;
const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 7px;
`;

const CopyInput = styled.input`
  flex-grow: 1;
  margin-right: 8px;
`;

const CopyButtonStyled = styled.button`
  background-color: ${(props) => (props.$copied ? '#2ecc71' : '#3498db')};
  color: #fff;
  padding: 8px;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;

  const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  `;
  
  const Popup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 100%;
    // background: #fff282;
    // height: 110px;
    // box-sizing: border-box;
    // padding: 10px;
    // border-radius: 5px;
    margin-bottom: 20px;
    margin-top: 20px;
    // 
    // font-size: 16px;
  
  
    p{
      font-size: 10px;
      margin-bottom: 16px;
    }
  
  `;
  
  const Dados = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px;
    &:last-child{
      margin-bottom: 40px;
    }
  `;
  
  const StyledSpinner = styled.div`
    width: 30px;
    height: 30px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid purple;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;


  const DadosPagamento = styled.div`
    // display: flex;
    // align-items: flex-end;
    // justify-content: left;
    width: 100%;
  
    // background-color: grey;
    padding-top: 1.5rem;
    padding-bottom: 20px;
    text-align: left;
    h1{
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 40px;
      }
    h2{
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 16px;
      }
    p{
      font-size: 18px;
      margin-bottom: 16px;
    }
  `;
  
  
  const ModalContent = styled.div`
    display:flex;
    justify-content: center;
    flex-direction:column;
    width:370px;
    background-color: #fff;
    border-radius: 0.375rem;
    padding: 1rem;
  
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
    h1{
      font-size: 24px;
      font-weight: bold;
      font-family: 'Montserrat', sans-serif;

      }
  `;
  
  const ModalButton = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    background-color: ${(props) => (props.$isloading ? '#ccc' : '#3182ce')};
    transition: background-color 0.2s;
    cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'pointer')};
  
    &:hover {
      ${(props) => (props.$isloading === true ? '' : 'background-color: #4299e1;')}
    }
  `;
  
  const QrCode = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  

  `;
  const Inserir = styled(IMaskInput)`
  width: 100%;
  height: 58px;
  font-size: 18px;
  margin-bottom: 16px;
  background-color: ${(props) => (props.$isloading ? '#F5F5F5' : '#FFFFFF')};
  border: 1px solid #D5D5D5;
  border-radius: 20px;
  padding: 10px;
  box-sizing: border-box;
  pointer-events: ${(props) => (props.$isloading ? 'none' : 'auto')};
  cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'text')};
  opacity: ${(props) => (props.$isloading ? '0.7' : '1')};  
  
  &:first-child {
      margin-top: 25px;
  }
  
  `;
  const Botao = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
  width: 100%;
  height: 46px;
  background: ${(props) => (props.$isloading ? '#999999' : '#28e241')};
  border-radius: 20px;
  border: none;
  
  cursor: ${(props) => (props.$isloading ? 'not-allowed' : 'pointer')};
  font-family: 'Raleway';
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      text-align: center;
      color: #FFFFFF;
      &:hover {
        ${(props) => (props.$isloading === true ? '' : 'background-color: #25c63b;')}
      }
  `;
  