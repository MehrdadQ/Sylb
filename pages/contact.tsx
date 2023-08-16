import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <>
      <NextSeo
        title="Contact - Sylb"
        description="Report an issue with your Sylb account or get in contact about any concerns or inquiries you may have."
      />
      <Navbar />
      <MainContainer>
        <div>
          <Header>Contact Me</Header>
          <h5>If you ever run into any issues with your account or have any questions, please don&apos;t hesitate
             to <span><a href="mailto:mehrdad.ghannad@gmail.com">reach out through email</a></span>.
          </h5>
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

  span {
    color: #5ca8fa;
  }
`;

const Header = styled.h2`
  padding-bottom: 1rem;
`;

export default Contact;