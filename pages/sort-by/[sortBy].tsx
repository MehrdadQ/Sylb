import { onAuthStateChanged } from "firebase/auth";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { NextPage } from "next";
import { NextSeo } from 'next-seo';
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import SearchResultItem from "../../components/SearchResultItem";
import LoadingIcon from "../../public/loading.svg";
import { getSortedResults, getUserInfo } from '../../utilities/api';
import { loadingState, userState } from '../../utilities/atoms';
import { auth } from "../../utilities/firebase";
import {
  EntryResultInfoCompact
} from "../../utilities/types";

const pageSize = 12;

const SortByPage: NextPage = () => {
  const [searchResults, setSearchResults] = useState<EntryResultInfoCompact[]>([]);
  const [message, setMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot<DocumentData> | null>(null);
  const [cachedSearchResults, setCachedSearchResults] = useState<{ [pageNumber: number]: EntryResultInfoCompact[] }>({});
  const [numPages, setNumPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortByDisplayValue, setSortByDisplayValue] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();

  useEffect(() => {
    if(!router.isReady) return;
    const { sortBy: sortBy } = router.query as { sortBy: string };
    if (sortBy === "courseAverage") {
      setSortBy("courseAverageNumValue");
      setSortByDisplayValue("See top UofT courses by course average.");
    } else if (sortBy === "semester") {
      setSortBy("semesterNumValue");
      setSortByDisplayValue("See latest UofT courses and syllabuses.");
    } else if (sortBy === "postTime") {
      setSortBy(sortBy);
      setSortByDisplayValue("See the most recently added UofT course syllabuses.");
    } else {
      goTo404();
    }

  }, [router.isReady, router.query]);
  
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
  }, [setUser, router, user])

  useEffect(() => {
    if (!sortBy) return;
    const fetchData = async () => {
      await handleSearch();
    };
    
    fetchData();
  }, [sortBy]);

  const goTo404 = () => {
    router.push("/404")
  }

  const handlePageChange = (pageNumber: number, useCache: boolean) => {
    if (cachedSearchResults[pageNumber] && useCache) {
      setCurrentPage(pageNumber);
      setSearchResults(cachedSearchResults[pageNumber]);
    } else {
      handlePageChangeMemo(pageNumber, !useCache);
    }
  };  

  const handlePageChangeMemo = async (pageNumber: number, searchFromBeginning: boolean) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    if (searchFromBeginning) {
      setLastVisibleDoc(null);
    }

    if (sortBy) {
      const { results, lastVisibleDoc: newLastVisibleDoc, errorMessage, totalCount } = 
        await getSortedResults(sortBy, pageNumber === 1, pageSize, searchFromBeginning ? null : lastVisibleDoc);

      if (pageNumber === 1 && totalCount) {
        const calculatedNumPages = Math.ceil(totalCount / pageSize);
        setNumPages(calculatedNumPages);
      }
      if (errorMessage) {
        setMessage(errorMessage);
      }
      setSearchResults(results);

      setCachedSearchResults((prevCachedResults) => ({
        ...prevCachedResults,
        [pageNumber]: results,
      }));

      setLastVisibleDoc(newLastVisibleDoc);
    }
    setIsLoading(false);
  };


  const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setMessage('');
    setCachedSearchResults([]);
    handlePageChange(1, false);
  };

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
  }

  if (user) return (
    <>
      <NextSeo
        title="Sylb"
        description={sortByDisplayValue}
      />
      <Navbar />
      <MainContainer>
        {
          isLoading ?
          <LoadingImage src={LoadingIcon} alt='loading'/> :
          message ?
          <Message>{message}</Message> :
          <ResultContainer>
            {searchResults.map((entry, index) => {
              return (
                <SearchResultItem entry={entry} key={index} showCourseAverage/>
              )
            })}
          </ResultContainer>
        }
        {searchResults.length > 0 &&
          <Pagination
            currentPage={currentPage}
            totalPages={numPages}
            goFirst={() => handlePageChange(1, true)}
            goLast={() => handlePageChange(numPages, true)}
            goBack={() => handlePageChange(currentPage - 1, true)}
            goNext={() => handlePageChange(currentPage + 1, true)}
            onPageClick={(pageNumber: number) => handlePageChange(pageNumber, true)}
            stepByStep={true}
          />
        }
      </MainContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

const ResultContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  width: 70%;
  margin-bottom: 1rem;
  
  @media (max-width: 1500px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 800px) {
    width: 90%;
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Message = styled.div`
  padding-top: 1rem;
  width: 70%;
  text-align: center;
  font-size: 20px;
  @media (max-width: 800px) {
    width: 90%;
  }
`;

const MainContainer = styled.div`
  position: relative;
  display: flex;
  padding-top: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #2D3748;

  .disabled {
    margin-top: 0px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    max-height: 0px;
    overflow: hidden;
    opacity: 0;
  }
  .enabled {
    opacity: 1;
    max-height: 700px;
    
    @media (max-width: 800px) {
      max-height: 1000px;
    }
  }
`;

const LoadingImage = styled(Image)`
  margin-top: 50px;
  margin-bottom: 50px;
  width: 50px;
  height: auto;
`;

export default SortByPage;