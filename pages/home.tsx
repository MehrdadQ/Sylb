import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import SearchResultItem from "../components/SearchResultItem";
import { getLatestSubmissions, getUserInfo } from "../utilities/api";
import { userState } from '../utilities/atoms';
import { auth } from "../utilities/firebase";
import { EntryResultInfoCompact } from "../utilities/types";

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [latestSubmissions, setLatestSubmissions] = useState<EntryResultInfoCompact[]>([]);

  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  
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

  useEffect(() => {
    const getData = async () => {
      setLatestSubmissions(await getLatestSubmissions());
    }
    getData();
  }, [])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search/${searchQuery.trim()}`);
    }
  };

  const goToInfoPage = (entryID: string) => {
    window.open(`/entry/${entryID}`, '_blank');
  };

  const goToAdvancedSearchPage = () => {
    router.push(`/advanced-search`);
  };

  if (user) return (
    <>
      <NextSeo
        title="Home - Sylb"
        description="Search for UofT courses and get access to syllabuses for free."
      />
      <Navbar />
      <MainContainer>
        <h2>Search for a course...</h2>
        <Container>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Enter course code here"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type='submit' variant="outline-success">Search</SearchButton>
          </Form>
        </Container>
        <Container style={{paddingTop: '0'}}>
          <AdvancedSearchButton onClick={goToAdvancedSearchPage}>
            Do an advanced search
          </AdvancedSearchButton>
        </Container>
        <Container>
          <h3>Most Recent Submissions</h3>
          <ResultContainer>
            {latestSubmissions.map((entry, index) => {
              return (
                <SearchResultItem entry={entry} key={index} openInNewTab={false}/>
              )
            })}
          </ResultContainer>
        </Container>
      </MainContainer>
    </>
  )
}

const Container = styled.div`
  padding: 1rem 3rem;
  width: 70%;

  @media (max-width: 1200px) {
    padding: 1rem 2rem;
    width: 85%;
  }

  @media (max-width: 800px) {
    padding: 1rem 1rem;
    width: 100%;
  }

  @media (max-width: 500px) {
    padding: 1rem;
    width: 100%;
  }
`;

const ResultContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MainContainer = styled.div`
  padding-top: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #2D3748;
`;


const SearchButton = styled(Button)`
  border-color: #488ED8 !important;
  color: #488ED8 !important;
  &:hover {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:active {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
  }
  &:focus-visible {
    background-color: #488ED8 !important;
    border-color: #488ED8 !important;
    color: white !important;
    box-shadow: 0 0 0 0.15rem rgba(255,255,255,0.7);
  }
`;

const AdvancedSearchButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #488ED8;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #ededee;
  cursor: pointer;
  font-size: 18px;
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
    background-color: #488ED8;
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 800px) {
    font-size: 16px;
    width: 100%;
  }
`;
export default Home;