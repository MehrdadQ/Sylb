import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { getLatestSubmissions } from "../utilities/api";
import { userState } from '../utilities/atoms';
import { auth } from "../utilities/firebase";
import { getCourseEmoji, timeAgo } from "../utilities/helpers";
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
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUser(uid)
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

  if (user) return (
    <>
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
        <Container>
          <h3>Most Recent Submissions</h3>
          <ResultContainer>
            {latestSubmissions.map((entry, index) => {
              return (
                <LatestResultItem key={index} onClick={() => goToInfoPage(entry.id)}>
                  <h5>{getCourseEmoji(entry.courseCode.slice(0,3))} {entry.courseCode}</h5>
                  <h6>{entry.semester}</h6>
                  <TimeAgo>{timeAgo(entry?.postTime)}</TimeAgo>
                </LatestResultItem>
              )
            })}
          </ResultContainer>
        </Container>
      </MainContainer>
    </>
  )
}

const Container = styled.div`
  padding: 1rem 4rem;
  width: 70%;

  @media (max-width: 1200px) {
    padding: 1rem 3rem;
    width: 85%;
  }

  @media (max-width: 800px) {
    padding: 1rem 2rem;
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

const LatestResultItem = styled.div`
  background-color: #0A121E;
  color: #ededee;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
`;

const TimeAgo = styled.p`
  float: right;
  margin-bottom: 0px;
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

export default Home;