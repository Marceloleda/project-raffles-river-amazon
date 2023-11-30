'use client'

import { findUser } from "../../services/api";
import Sidebar from "../../components/sidebar/index";
import { styled } from "styled-components";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import CreateCampaign from "../../components/createCampaign";
import FindCampaign from "../../components/findCampaign/index";

export default function Seller(){
    // const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [showFindCampaign, setShowFindCampaign] = useState(false);
    const [user, setUser] = useState({})


    const handleCreateCampaign = () => {
        setShowCreateCampaign(true);
        setShowFindCampaign(false);
      };
    
      const handleFindCampaign = () => {
        setShowFindCampaign(true);
        setShowCreateCampaign(false);
      };
      const handleRefresh = () => {
        setShowFindCampaign(false);
        setShowCreateCampaign(false);
      };

    useEffect(()=>{
        findUser()
            .then((res)=>{
                setUser(res.data)
                setIsLoading(false);
            })
            .catch((err=>{
                console.log(err.message)
                setIsLoading(true);
            }))
    },[])

    return (
        <>
            {isLoading ? (
              <SpinnerContainer>
                <StyledSpinner />
              </SpinnerContainer>
              ) : (
                <SellerPageWrapper>
                    <Sidebar onFindCampaign={handleFindCampaign} onHome={handleRefresh}/>
                    <SellerPage>
                        <HeaderMini>
                            <h1>Dashboard</h1>
                        </HeaderMini>
                        <DataUser>
                            <h3>Saldo: {user.total_ticket_plan}</h3>
                            <h3>{user.plans?.name}</h3>                
                        </DataUser>
                        {(!showCreateCampaign && !showFindCampaign) && (
                          <Blocks>
                            <Block onClick={handleCreateCampaign}>Criar Campanha</Block>
                            {/* <Block onClick={handleCreateCampaign}>
                              <h3>Receber pagamentos</h3>
                            </Block> */}
                          </Blocks>
                        )}
                        {showCreateCampaign && <CreateCampaign />}
                        {showFindCampaign && <FindCampaign />}
                    </SellerPage>
                </SellerPageWrapper>
            )}
        </>
    )
}

const SellerPage = styled.div`
font-family: 'Roboto', sans-serif;
display:flex;
flex-direction: column;
padding: 20px;
flex:1;
box-sizing: border-box;
background: #f7f2e6;
height: 100vh;

h2{
    margin-bottom: 50px;
}
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
const SellerPageWrapper = styled.div`
  display: flex;
`;
const HeaderMini = styled.div`
display:flex;
justify-content: center;
align-items: center;
height: 60px;
width: 100%;
background-color: black;
margin-bottom: 40px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    h1{
        color:white;
        font-size:35px;
    }
`;
const Block = styled.div`
display: flex;
justify-content: center;
align-items: center;
color: black;
font-size: 30px;
height: 220px;
width:220px;
margin-left: 30px;
cursor: pointer;
&:hover {
    background-color: #ff847c;
}
padding:15px;
border-radius: 20px;
border: 1px solid black;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
h3{
  font-size:20px;
}

`;
const Blocks = styled.div`
display: flex;
width:100%;


`;
const DataUser = styled.div`
margin-bottom: 50px;
height: 50px;
box-sizing: border-box;
padding: 20px;

display:flex;
justify-content: space-between;
align-items: center;
border-radius: 20px;
border: 1px solid black;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

`;