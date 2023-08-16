import 'firebase/compat/storage';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import SearchResultItem from '../../components/SearchResultItem';
import LoadingIcon from "../../public/loading.svg";
import { getEntriesByCourseCode } from '../../utilities/api';
import { loadingState } from '../../utilities/atoms';
import { EntryResultInfo } from '../../utilities/types';
import Link from 'next/link';

const SearchPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<EntryResultInfo[]>([]);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  const { query: searchQuery } = router.query as { query: string };

  useEffect(() => {
    setIsLoading(true);
    if (searchQuery) {
      const upperCaseSearchQuery = searchQuery.toUpperCase();
      
      const getData = async () => {
        try {
          const data = await getEntriesByCourseCode(upperCaseSearchQuery); 
          setResults(data);
        }
        catch {
          toastError("Oops! Something went wrong. Please try again.")
          setIsLoading(false)
        }
        finally {
          setIsLoading(false)
        }
      }
      getData();
    }
  }, [searchQuery, setIsLoading]);

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

  return (
    <>
      <NextSeo
        title={searchQuery ? `${searchQuery} - Search Results` : "Sylb"}
        description={`Download ${searchQuery} syllabus for free. Get ${searchQuery} course information sheet for free.`}
      />
      <Navbar />
      {isLoading || !searchQuery ?
        <LoadingImage src={LoadingIcon} alt='loading'/> :
        <>
          <MainContainer>
            <TopContainer>
              <h3>Search Results for: {searchQuery.toUpperCase()}</h3>
              <Button as={Link} href={'/advanced-search'}>Try an Advanced Search</Button>
            </TopContainer>
            {results.length == 0 ? 
            <NoResultsMessage>Unfortunately, there were no results for {searchQuery.toUpperCase()} 😢</NoResultsMessage> :
            <ResultContainer>
              {results.map((result, index) => (
                <SearchResultItem entry={result} key={index}/>
              ))}
            </ResultContainer>
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
      }
    </>
  );
}

const TopContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
  }

  @media (max-width: 700px) {
    flex-wrap: wrap-reverse;
    button {
      font-size: 15px !important;
    }
    h3 {
      font-size: 18px !important;
    }
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 30rem;
  @media (max-width: 1700px) {
    margin: 1rem 20rem;
  }
  @media (max-width: 1400px) {
    margin: 1rem 6rem;
  }
  @media (max-width: 700px) {
    margin: 1rem;
  }
`;

const ResultContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 1rem;
  
  @media (max-width: 1500px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const NoResultsMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const LoadingImage = styled(Image)`
  width: 50px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
`;

const Button = styled.button`
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  display: inline-block;
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

  @media (max-width: 500px) {
    padding: 6px 9px;
    width: 100%;
    margin-bottom: 1rem;
  }
`

export default SearchPage;