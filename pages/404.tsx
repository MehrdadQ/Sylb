import { NextPage } from 'next';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import Image404 from '../public/404.png'
import Image from 'next/image';
import { useRouter } from 'next/router';

const Custom404: NextPage = () => {
  const router = useRouter();
  
  const goToHome = () => {
    router.push("/home")
  }


  return (
    <div>
      <Navbar/>
      <Container>
        <TextSection>
          <h1>Sorry! The page you&apos;re looking for cannot be found.</h1>
          <Button onClick={goToHome}>Back to Home</Button>
        </TextSection>
        <Picture src={Image404} alt='404' width={500} style={{maxWidth: "100%", height: "auto"}}/>
      </Container>
    </div>
  );
};

const Picture = styled(Image)`
  max-width: 100%;
  height: auto;
`

const Container = styled.div`
  padding: 5rem 12rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;

  @media (max-width: 1500px) {
    padding: 5rem;
    justify-content: center;
  }

  @media (max-width: 1200px) {
    padding: 2rem 0rem;
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
