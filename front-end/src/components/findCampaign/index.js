import { deleteOneRaffle, findCampaigns } from "../../services/api";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';

import { IconButton, Skeleton } from "@mui/material";
import Swal from "sweetalert2";

export default function FindCampaign() {
  const router = useRouter();
  const [campaignsData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    findCampaigns()
      .then((res) => {
        setCampaignData(res.data);
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false)
      });
  }, []);

  const handleViewRaffle = (id, title) => {
    const title_ = title.replace(/ /g, "-");
    const url = `/raffle/${id}/${title_}`;
    window.open(url, '_blank');
  };
  
  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  async function deleteRaffle(id) {
    Swal.fire({
      title: "Você tem certeza que deseja excluir esta rifa?",
      text: "Isto é uma ação irreversível, VOCÊ PERDERÁ TODOS OS DADOS DESTA RIFA!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Voltar",
      confirmButtonText: "Sim, desejo excluir esta rifa"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Excluido!",
          text: "A Rifa foi excluida!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
        deleteOneRaffle(id)
          .then((res) => {
            setCampaignData((prevData) => prevData.filter((data) => data.id !== id));
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  }

  const rafflesCard = campaignsData.map((data, id) => {
    if(data.is_deleted !== true){
      return(
        <Raffle key={id}>
          <Title>
            <h1>Rifa: {truncateString(data.title, 30)}</h1>
          </Title>
          <h2>Total de cotas: {data.total_tickets}</h2>
          <h2>Valor: R$ {data.ticket_price}</h2>
          <h3>Expira em: {data.expire_at}</h3>
          <ButtonContainer>
            <Button onClick={() => handleViewRaffle(data.id, data.title)}>Ver pagina da Rifa</Button>
            <DeleteButton onClick={() => deleteRaffle(data.id)}>
              <DeleteIcon/>
                Excluir Rifa
            </DeleteButton>
          </ButtonContainer>
        </Raffle>
      )
    }
  });

  return (
  <>
    {isLoading ? (
      <Container>
        <Skeleton sx={{ height: 350, width: 200, borderRadius:7, padding:"15px", margin: 2 , position: "relative"}} animation="wave" variant="rectangular" />
        <Skeleton sx={{ height: 350, width: 200, borderRadius:7, padding:"15px", margin: 2, position: "relative"}} animation="wave" variant="rectangular" />
        <Skeleton sx={{ height: 350, width: 200, borderRadius:7, padding:"15px", margin: 2, position: "relative"}} animation="wave" variant="rectangular" />
        <Skeleton sx={{ height: 350, width: 200, borderRadius:7, padding:"15px", margin: 2, position: "relative"}} animation="wave" variant="rectangular" />

      </Container>
      ) : (
    <Container>
      {rafflesCard}
    </Container>
    )}

  </>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;
const Title = styled.div`

`;
const ButtonContainer = styled.div`
  position: absolute; /* Define a posição absoluta para os botões */
  bottom: 10px; /* Define a distância dos botões em relação ao final do card */
  left: 50%; /* Centraliza os botões horizontalmente */
  transform: translateX(-50%); /* Centraliza os botões horizontalmente */
`;

const Raffle = styled.div`
  height: 400px;
  width: 250px;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden; /* Adicionado para evitar que o conteúdo ultrapasse a altura do card */
`;
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  background: #f2f2f2;
  align-items: center;
  height: 100vh;
`;
const StyledSpinner = styled.div`
  width: 50px;
  height: 50px;
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
const DeleteButton = styled.button`
  display: flex;
  justify-content:center;
  align-items: center;
  width: 200px;
  height: 30px;
  background-color: #ff847c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e74c3c;
  }
`;

const Button = styled.button`
  width: 200px;
  margin-bottom: 10px;
  background-color: #56bc86;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  &:hover {
    background-color: #2ce080;
  }
}`;