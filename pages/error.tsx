import Navbar from "../components/Navbar";
import styled from 'styled-components';

const Error = () => {
  return (
    <>
      <Navbar />
      <MainContainer>
        <div>
          <Header>Payment Failed</Header>
          <h5>Sorry, there was an issue processing your payment. Please try again.</h5>
          <h5>If you think this is a mistake, please submit a report through the contact page.</h5>
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
`;

const Header = styled.h2`
  padding-bottom: 1rem;
`;

export default Error;