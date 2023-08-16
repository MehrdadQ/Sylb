import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import Navbar from "../components/Navbar";
import Link from 'next/link';

const Error = () => {
  return (
    <>
      <NextSeo
        title="Error - Sylb"
        description="There was an issue processing your payment."
      />
      <Navbar />
      <MainContainer>
        <div>
          <Header>Payment Failed</Header>
          <h5>Sorry, there was an issue processing your payment. Please try again.</h5>
          <h5>If you think this is a mistake, please visit the <Link href='/contact'>contact page</Link>.</h5>
        </div>
      </MainContainer>
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

  a {
    color: #5ca8fa;
  }
`;

const Header = styled.h2`
  padding-bottom: 1rem;
`;

export default Error;