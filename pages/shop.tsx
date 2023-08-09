import { onAuthStateChanged } from 'firebase/auth';
import 'firebase/compat/storage';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import CheckoutButton from "../components/CheckoutButton";
import Navbar from '../components/Navbar';
import { getUserInfo } from '../utilities/api';
import { loadingState, userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';
import styled from 'styled-components';

const SuggestEditPage: React.FC = () => {
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();

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
  }, [setUser, router])

  const toastError = (errorMessage: string) => {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const goToLandingPage = () => {
    router.push('/');
  };

  const goToAddEntry = () => {
    router.push('/add-entry');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      goToLandingPage();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <NextSeo
        title="Shop - Sylb"
        description="Get more Sylb credits or purchase premium to get access to all UofT syllabuses."
      />
      <Navbar />
      <MainContainer>
        <Container>
          <h3>You currently have {user?.credits!} Credits</h3>
          <InfoText>The credit system serves to encourage contributions from all users,
            helping our syllabus collection grow for everyone&apos;s benefit.
            </InfoText>
          <InfoText>
            Adding your syllabus earns you credits, so we recommend heading to
            the <span onClick={goToAddEntry}>Add Entry page</span> if you haven&apos;t done so already.
          </InfoText>
          <InfoText>
            Pro tip: You can get access to previous course pages on Quercus by going
            to <span><a href='https://q.utoronto.ca/courses' target='blank'>https://q.utoronto.ca/courses</a></span>
            . You should be able to see most of your previous courses under Past Enrollments!
          </InfoText>
          <InfoText>
            If you need more credits, explore the following options:
          </InfoText>
          <CardContainer>
            <Card>
              <h4>5 Credits</h4>
              <h5>$2.79</h5>
              <CheckoutButton
                name="5 Sylb Credits"
                description="Get 5 Sylb Credits which can be used to purchase access to syllabus files."
                price="279"
              />
            </Card>
            <Card>
              <h4>10 Credits</h4>
              <h5>$4.79</h5>
              <CheckoutButton
                name="10 Sylb Credits"
                description="Get 10 Sylb Credits which can be used to purchase access to syllabus files."
                price="479"
              />
            </Card>
            <Card>
              <h4>Unlimited Credits</h4>
              <h5>$9.99</h5>
              <CheckoutButton
                name="Unlimited Credits"
                description="Get unlimited Sylb Credits which can be used to purchase access to syllabus files."
                price="999"
              />
            </Card>
          </CardContainer>
          <p style={{color: "#c3c3c3", textAlign: "center"}}>
            All transactions are done through <span><a href='https://stripe.com' target='blank'>Stripe</a></span>!
          </p>
        </Container>
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 70%;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;

  span {
    color: #64afff;
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    width: 85%;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1500px) {
    width: 90%;
  }

  @media (max-width: 800px) {
    width: 100%;
  }

  @media (max-width: 430px) {
    grid-template-columns: repeat(1, 1fr);
  }

`;

const InfoText = styled.div`
  font-size: 22px;
  margin-bottom: 1rem;

  @media (max-width: 1000px) {
    font-size: 18px;
  }

  @media (max-width: 800px) {
    font-size: 16px;
  }
`;

const Card = styled.div`
  background-color: #0A121E;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default SuggestEditPage;
