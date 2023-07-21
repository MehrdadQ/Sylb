import 'firebase/compat/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import ResultItem from '../../components/ResultItem';
import LoadingIcon from "../../public/loading.svg";
import { loadingState } from '../../utilities/atoms';
import { firestore } from './../../utilities/firebase';


interface SearchResult {
  id: string;
  courseCode: string;
  semester: string;
  professor: string;
  autofail: string;
  courseAverage: string;
  courseDelivery: string;
  tutorials: string;
  hasEssay: string;
  syllabusLink: string;
  groupProjects: string;
  courseWebsite: string;
  postTime: Date | undefined;
  otherNotes: string;
}

const SearchPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  const { query: searchQuery } = router.query as { query: string };

  useEffect(() => {
    setIsLoading(true);
    if (searchQuery) {
      const upperCaseSearchQuery = searchQuery.toUpperCase();
      const searchFirestore = async () => {
        const entriesRef = collection(firestore, 'entries');
        const q = query(entriesRef, where('courseCode', '>=', upperCaseSearchQuery), where('courseCode', '<', upperCaseSearchQuery + '\uf8ff'));
        
        try {
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SearchResult));
          setResults(data);
          setIsLoading(false)
        } catch (error) {
          toastError("Oops! Something went wrong. Please try again.")
          setIsLoading(false)
        }
      };
      searchFirestore();
    }
  }, [searchQuery]);

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

  return (
    <>
      <Navbar />
      {isLoading || !searchQuery ?
        <LoadingImage src={LoadingIcon} alt='loading'/> :
        <>
          <ResultsContainer>
            <SearchTitle>Search Results for: {searchQuery.toUpperCase()}</SearchTitle>
            {results.length == 0 ? 
            <NoResultsMessage>Unfortunately, there were no results for {searchQuery.toUpperCase()} 😢</NoResultsMessage> :
            <>
            <ResultItem
              key={"header"}
              entryID={'header'.toUpperCase()}
              courseCode={"Course Code".toUpperCase()}
              professor={"Professor".toUpperCase()}
              semester={"Semester".toUpperCase()}
              backgroundColor={'#0f2649'}
            />
            {results.map((result, index) => (
              <ResultItem
                key={result.id}
                entryID={result.id}
                courseCode={result.courseCode}
                professor={result.professor}
                semester={result.semester}
                backgroundColor={index % 2 == 0 ? '' : '#112c55'}
              />
            ))}
            </>
            }
          </ResultsContainer>
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

const SearchTitle = styled.h3`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid white;
`;

const ResultsContainer = styled.div`
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

export default SearchPage;