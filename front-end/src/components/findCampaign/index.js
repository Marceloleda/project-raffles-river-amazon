import { deleteOneRaffle, findCampaigns } from "../../services/api";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from 'next/navigation';

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
    router.push(`/raffle/${id}/${title_}`);
  };

  async function deleteRaffle(id) {
    deleteOneRaffle(id)
      .then((res) => {
        setCampaignData((prevData) => prevData.filter((data) => data.id !== id));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const rafflesCard = campaignsData.map((data, id) => {
    return (
      <Raffle key={id}>
        <h1>Rifa: {data.title}</h1>
        <h2>Total de cotas: {data.total_tickets}</h2>
        <h2>Valor: R$ {data.ticket_price}</h2>
        <h3>Expira em: {data.expire_at}</h3>
        <Button onClick={() => handleViewRaffle(data.id, data.title)}>Ver pagina da Rifa</Button>
        <DeleteButton onClick={() => deleteRaffle(data.id)}>Excluir Rifa</DeleteButton>
      </Raffle>
    );
  });

  return (
  <>
    {isLoading ? (
        <SpinnerContainer>
          <StyledSpinner />
        </SpinnerContainer>
      ) : (
    <Container>{rafflesCard}</Container>
    )}

  </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: wrap;
  width: 100%;
`;

const Raffle = styled.div`
  height: 350px;
  width: 200px;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
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
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
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
  position: absolute;
  width: 70%;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
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