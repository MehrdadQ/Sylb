import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Image404 from '../public/404.png';

const Custom404: NextPage = () => {
  const [showAttribution, setShowAttribution] = useState(false);
  const router = useRouter();

  return (
    <>
      <NextSeo
        title="Sylb - Page not found"
        description="Sylb - Page not found"
      />
      <Navbar/>
      <MainContainer>
        <Container>
          <TextSection>
            <h1>Sorry! The page you&apos;re looking for cannot be found.</h1>
            <Button as={Link} href={'/home'}>Back to Home</Button>
          </TextSection>
          <div style={{display: "flex", flexDirection: "column", color: "#0a121e"}}>
            <Picture src={Image404} alt='404' width={500} style={{maxWidth: "100%", height: "auto"}} onClick={() => setShowAttribution(!showAttribution)}/>
            {showAttribution && <a href="https://www.vecteezy.com/free-vector/vector">Vector Vectors by Vecteezy</a>}
          </div>
        </Container>
      </MainContainer>
    </>
  );
};

const Picture = styled(Image)`
  max-width: 100%;
  height: auto;
`

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;
  
  @media (max-width: 1500px) {
    width: 85%;
    justify-content: center;
  }
  
  @media (max-width: 1200px) {
    width: 100%;
    justify-content: center;
  }
`

const TextSection = styled.div`
  width: 50%;
  @media (max-width: 1200px) {
    width: 80%;
    margin: 2rem 0;
  }
`

const Button = styled.button`
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 9px 15px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: auto;
  margin-top: 1rem;
  float: right;

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
`

export default Custom404;
