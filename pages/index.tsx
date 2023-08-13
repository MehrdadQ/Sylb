import { onAuthStateChanged } from "firebase/auth";
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Fade, Slide } from "react-awesome-reveal";
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { useRecoilState } from "recoil";
import styled, { keyframes } from 'styled-components';
import CustomNavBar from "../components/Navbar";
import ScrollDownArrow from '../components/ScrollDownArrow';
import VectorArt1 from "../public/vectorArt1.png";
import VectorArt2 from "../public/vectorArt2.png";
import VectorArt3 from "../public/vectorArt3.png";
import LandingPageBg from "../public/landing_page_bg.svg";
import LandingPageBg2 from "../public/landing_page_bg2.svg";
import ProfessorIcon from "../public/professor.svg";
import SyllabusIcon from "../public/syllabus.svg";
import TargetIcon from "../public/target.svg";
import { getUserInfo } from "../utilities/api";
import { userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';

const LearnMoreText = [
  "We've all been there. It's time to select courses, and we have too many questions that need to be answered.\
  Where do we find the syllabus? What was the course average last semester? \
  Are tutorials mandatory? Are the lectures recorded?",
  "Introducing Sylb! All your questions answered. Sign up for free and unlock the power of \
  knowledge-sharing. 📚💡",
  "By students, for students. 💪"
];

const HowItWorksText = [
  "Upload Syllabus Files: Contribute by adding your course syllabus to our collection.",
  "Earn Credits: You'll start off with 3 credits and earn more for each syllabus you upload.",
  "Access Other Syllabus Files: Use your credits to access syllabi from other courses."
];


const Main: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        if (!user) {
          setUser(await getUserInfo(uid));
        }
      }
    });
  }, [setUser])

  const goToSignup = () => {
    router.push('/signup');
  };
  
  const goToLogin = () => {
    router.push('/login');
  }
  
  const goToHome = () => {
    router.push('/home');
  }

  const scrollToLearnMore = () => {
    const element = document.getElementById('learn-more');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <NextSeo
        title="Sylb"
        description="Get UofT syllabuses and course information for free."
      />
      {!user ?
        <Sticky>
          <Navbar>
            <Navbar.Brand href="#">
              <Image
                src="logo.svg"
                width="50"
                height="50"
                className="d-inline-block align-top"
                alt="Logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <ButtonContainer>
                <Nav>
                  <NavItem>
                    <NavButton onClick={goToSignup}>
                      Sign up
                    </NavButton>
                  </NavItem>
                  <NavItem>
                    <NavButton onClick={goToLogin}>
                      Log in
                    </NavButton>
                  </NavItem>
                </Nav>
              </ButtonContainer>
            </Navbar.Collapse>
          </Navbar> 
        </Sticky> : 
        <CustomNavBar/>
      }
      <FullHeightDiv style={{backgroundImage: `url(${LandingPageBg.src})`}}>
        {/* <Image src={LandingPageBg} width={0} height={0} alt="art" style={{position: "absolute", overflow: "hidden", width: "auto", height: "100%"}}/> */}
        <Slide className="slide" style={{marginBottom: "3rem"}}>
          <Section id="intro">
            <TextSection>
              <MainTitle>Welcome to <span>Sylb</span>,</MainTitle>
              <MainText>The ultimate course information guide for UofT students</MainText>
              <ButtonGroup>
                {!user ? 
                  <CallToActionBtn onClick={goToSignup}>
                    Sign Up For Free
                  </CallToActionBtn> :
                  <CallToActionBtn onClick={goToHome}>
                    Home
                  </CallToActionBtn>
                }
                <CallToActionBtn onClick={scrollToLearnMore}>
                  Learn More
                </CallToActionBtn>
              </ButtonGroup>
            </TextSection>
            <ImgContainer>
              <Image src={VectorArt1} alt='art' width={400} height={400} style={{maxWidth: "100%", height: "auto"}}/>
            </ImgContainer>
          </Section>
        </Slide>
        <div onClick={scrollToLearnMore}>
          <ScrollDownArrow/>
        </div>
      </FullHeightDiv>
      <MiddleContainerWrapper>
        <MiddleContainer>
          <CenteredFade delay={400} fraction={0.5}>
            <IconContainer style={{animationDelay: "0.4s"}}>
              <Image src={TargetIcon} width={60} alt="target" />
              <h5>Course Averages</h5>
            </IconContainer>
          </CenteredFade>
          <CenteredFade delay={600} fraction={0.5}>
            <IconContainer style={{animationDelay: "0.6s"}}>
              <Image src={SyllabusIcon} width={60} alt="target" />
              <h5>Syllabus Files</h5>
            </IconContainer>
          </CenteredFade>
          <CenteredFade delay={800} fraction={0.5}>
            <IconContainer style={{animationDelay: "0.8s"}}>
              <Image src={ProfessorIcon} width={60} alt="target" />
              <h5>Professor Data</h5>
            </IconContainer>
          </CenteredFade>
          
        </MiddleContainer>
      </MiddleContainerWrapper>

      <FullHeightDiv style={{backgroundImage: `url(${LandingPageBg2.src})`}} id="learn-more">
        <Slide direction='right' className="slide" >
          <Section>
            <ImgContainer>
              <Image src={VectorArt2} alt='art' width={500} style={{ maxWidth: "100%", height: "auto"}}/>
            </ImgContainer>
            <TextSection>
              <SectionTitle>Your Secret Weapon for Course Selection</SectionTitle>
              {LearnMoreText.map((line, index) => {
                return <Text key={index}>{line}</Text>
              })}
            </TextSection>
          </Section>
        </Slide>
      </FullHeightDiv>
      <FullHeightDiv style={{backgroundImage: `url(${LandingPageBg.src})`}}>
        <Slide direction='left' className="slide" >
          <Section style={{marginTop: "3rem", marginBottom: "3rem"}}>
            <TextSection>
              <SectionTitle>How it works</SectionTitle>
              {HowItWorksText.map((line, index) => {
                return <Text key={index}>{line}</Text>
              })}
              {!user ? 
                <CallToActionBtn onClick={goToSignup} style={{float: "right"}}>
                  Sign Up For Free
                </CallToActionBtn> :
                <CallToActionBtn onClick={goToHome} style={{float: "right"}}>
                  Go To Home
                </CallToActionBtn>
              }
            </TextSection>
            <ImgContainer>
              <Image src={VectorArt3} alt='art' width={400} style={{ maxWidth: "100%", height: "auto"}}/>
            </ImgContainer>
          </Section>
        </Slide>
      </FullHeightDiv>
    </>
  )
}

const ImgContainer = styled.div`
  position: relative;
  height: fit-content;
  overflow: hidden;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  align-items: end;
`;

const FullHeightDiv = styled.div`
  overflow: hidden;
  position: relative;
  min-height: calc(90vh - 60px);
  background-size: cover;
  width: 100%;
  height: 100%;
  .slide {
    overflow: hidden;
    color: #EDEDEE;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CallToActionBtn = styled.button`
  margin: 10px;
  align-items: center;
  appearance: none;
  background-color: #FCFCFD;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395A;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;

  &:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
  }

  @media (max-width: 1200px) {
    font-size: 14px;
  }
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  overflow: hidden;
  width: 70%;
  padding: 2rem;
  margin-top: 10rem;
  backdrop-filter: blur(10px);
  border: 1px solid #aaaaaa;
  border-radius: 15px;

  @media (max-width: 1600px) {
    width: 80%;
  }
  @media (max-width: 1350px) {
    justify-content: center;
    width: 90%;
  }
  @media (max-width: 800px) {
    margin-top: 3rem;
    padding: 1rem;
  }
`;

const MainTitle = styled.h2`
  font-size: 48px;

  span {
    color: #488ED8;
  }

  @media (max-width: 1200px) {
    font-size: 36px;
  }
  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  @media (max-width: 1200px) {
    font-size: 28px;
  }
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const MainText = styled.p`
  font-size: 32px;
  @media (max-width: 1200px) {
    font-size: 22px;
  }
  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

const Text = styled.p`
  font-size: 22px;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const TextSection = styled.div`
  width: 50%;
  @media (max-width: 1200px) {
    width: 80%;
    margin: 2rem 0;
  }
  @media (max-width: 600px) {
    width: 95%;
    margin: 1rem 0;
  }
`;

const Sticky = styled.div`
  position: sticky;
  position: -webkit-sticky;
  width: 100%;
  top: 0;
  z-index: 100;
  background-color: #2D3748;
  color: #EDEDEE;
  border-bottom: 1px solid black;
  padding: 0px 30px;
`

const ButtonContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const NavButton = styled.button`
  padding-left: 20px;
  margin-left: 20px;
  border: none;
  background-color: transparent;
  transition: background-color 0.3s, transform 0.3s;

  &:disabled {
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: none;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 0px 8px;
    margin: 0px 8px;
  }
`;

const MiddleContainer = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: 800px) {
    width: 90%;
  }
  font-family: monospace;
`;

const MiddleContainerWrapper = styled.div`
  height: 100%;
  overflow: visible;
  background-color: #0a121e;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
`;

const IconContainer = styled.div`
  padding: 0 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #aaaaaa;
  text-align: center;
  padding-top: 3rem;
  animation: ${bounceAnimation} 2s infinite;

  h5 {
    padding-top: 1rem;
  }

  @media (max-width: 800px) {
    padding: 0 1rem;
  }
`;

const CenteredFade = styled(Fade)`
  height: 100%;
  display: flex;
`;

export default Main;
