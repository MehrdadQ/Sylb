import type { NextPage } from 'next';
import Image from 'next/image';
import { Slide } from "react-awesome-reveal";
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import ScrollDownArrow from '../components/ScrollDownArrow';

const LearnMoreText = [
  "We've all been there. It's time to select courses, and we have too many questions that need to be answered.\
  Where do we find the syllabus? Does this course require an essay? Is there an autofail on the exam? \
  Are there group projects? What does the grading scheme look like? \
  Are tutorials mandatory? And who's the best professor for this course?",
  "Introducing Sylb! All your questions answered. Sign up for free and unlock the power of \
  knowledge-sharing. 📚💡",
  "By students, for students. 💪"
]


const Home: NextPage = () => {
  const scrollToLearnMore = () => {
    const element = document.getElementById('learn-more');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  return (
    <>
      <NavigationBar />
      <FullHeightDiv>
        <Slide>
          <Section id="intro">
            <TextSection>
              <MainTitle>Welcome to <span>Sylb.io</span>,</MainTitle>
              <MainText>The ultimate course information guide for UofT students</MainText>
              <ButtonGroup>
                <CallToActionBtn>
                  Sign Up For Free
                </CallToActionBtn>
                <CallToActionBtn onClick={scrollToLearnMore}>
                  Learn More
                </CallToActionBtn>
              </ButtonGroup>
            </TextSection>
            <ImgContainer>
              <Image src="/../public/hero2.png" alt='art' width={400} height={400} style={{maxWidth: "100%", height: "auto"}}/>
            </ImgContainer>
          </Section>
        </Slide>
        <div onClick={scrollToLearnMore}>
          <ScrollDownArrow/>
        </div>
      </FullHeightDiv>
      <SvgContainer>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </SvgContainer>
      <FullHeightDiv style={{backgroundColor: "#0A121E", paddingTop: "50px"}}>
        <Slide direction='right'>
          <Section id="learn-more">
            <ImgContainer>
              <Image src="/../public/hero4.png" alt='art' width={500} height={300} style={{ maxWidth: "100%", height: "auto"}}/>
            </ImgContainer>
            <TextSection>
              <Title>Your Secret Weapon for Course Selection</Title>
              {LearnMoreText.map((line, index) => {
                return <Text key={index}>{line}</Text>
              })}
            </TextSection>
          </Section>
        </Slide>
      </FullHeightDiv>
    </>
  )
}

const SvgContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  line-height: 0;
  shape-rendering: crispEdges;
  transform: rotate(180deg);
  background-color: #0A121E;

  svg {
    position: relative;
    display: block;
    width: calc(140% + 1.3px);
    height: 110px;
  }

  .shape-fill {
    fill: #2D3748;
  }
`

const ImgContainer = styled.div`
  position: relative;
  height: fit-content;
  overflow: hidden;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  align-items: end;
`

const FullHeightDiv = styled.div`
  min-height: calc(100vh - 60px);
  background-color: #2D3748;
  overflow-x: hidden;
  color: #EDEDEE;
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
`

const Section = styled.div`
  padding: 10rem 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;

  @media (max-width: 1200px) {
    padding: 8rem 1rem;
    justify-content: center;
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
`

const Title = styled.h2`
  font-size: 42px;
  @media (max-width: 1200px) {
    font-size: 28px;
  }
`

const MainText = styled.p`
  font-size: 32px;
  @media (max-width: 1200px) {
    font-size: 22px;
  }
`

const Text = styled.p`
  font-size: 22px;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
`

const TextSection = styled.div`
  width: 50%;
  @media (max-width: 1000px) {
    width: 80%;
    margin: 2rem 0;
  }
`

export default Home;
