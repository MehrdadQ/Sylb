import { onAuthStateChanged } from "firebase/auth";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from "../components/Navbar";
import { confirmSessionId, getUserInfo } from "../utilities/api";
import { userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';

const Success = () => {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();
  const [valid, setValid] = useState<boolean>(false);

  const { session_id } = router.query;

  useEffect(() => {
    const goToLogin = () => {
      router.push("/login")
    }
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        if (!user) {
          setUser(await getUserInfo(uid));
        }
      } else {
        goToLogin();
      }
    });
  }, [setUser])

  useEffect(() => {
    const fetchData = async () => {
      if (session_id) {
        setValid(await confirmSessionId(session_id as string));
      }
    };
    
    fetchData();
  }, [session_id]);
  
  const goToHome = () => {
    router.push('/home');
  }
  
  return (
    <>
      <NextSeo
        title={valid ? "Payment Successful - Sylb" : "Sylb"}
        description={valid ? "Payment Successful - Sylb" : "Sylb"}
      />
      <Navbar />
      {user ?
        <MainContainer>
          {valid ?
            <Container>
              <Header>Payment Successful! You now have {user?.credits! > 10000 ? 'unlimited' : user?.credits} credits!</Header>
              <Button onClick={goToHome}>Go to Home</Button>
            </Container> :
            <Container>
              <Header>
                Oops! It seems like there was an issue with the payment confirmation.
                If you believe this is an error, please visit the <a href='/contact'>contact page</a>.
              </Header>
            </Container>
          }
        </MainContainer> : <></>
      }
    </>
  );
}

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Container = styled.div`
  text-align: center;
  width: 60%;

  @media (max-width: 800px) {
    width: 100%;
    h2 {
      font-size: 18px;
    }
  }
`;

const Header = styled.h2`
  padding-bottom: 1rem;

  a {
    color: #5ca8fa;
  }
`;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 13px 23px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: 100%;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    background-color: #F7F7F7;
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    border-color: #DDDDDD;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
  }

  div {
    margin-left: 18px;
  }

  @media (max-width: 800px) {
    font-size: 14px;
    width: 100%;
  }
`;

export default Success;