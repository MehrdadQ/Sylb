import 'firebase/compat/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import ResultItem from '../../components/ResultItem';
import { loadingState } from '../../utilities/atoms';
import { firestore } from '../../utilities/firebase';
import Image from 'next/image';
import LoadingIcon from "../../public/loading.svg";
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios'
import fileDownload from 'js-file-download'


interface Info {
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
  postTime: Date | null;
  otherNotes: string;
  multipleChoice: string;
}

const SearchPage = () => {
  const router = useRouter();
  const [info, setInfo] = useState<Info | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  const { entryID: entryID } = router.query as { entryID: string };

  const getEntryById = async (entryId: string) => {
    const entryRef = doc(firestore, 'entries', entryId); // 'entries' is the name of your Firestore collection
  
    try {
      const entrySnapshot = await getDoc(entryRef);
      if (entrySnapshot.exists()) {
        const entryData = entrySnapshot.data();
        return entryData;
      } else {
        setNotFound(true);
        return null;
      }
    } catch (error) {
      toastError("Something went wrong. Please try again.")
      return null;
    }
  };

  const getEntryData = async () => {
    const data = await getEntryById(entryID);
    setInfo(data as Info);
    setIsLoading(false);
    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    if (entryID) {
      getEntryData();
    }
  }, [entryID]);
  

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

  const handleDownload = (url: string, filename: string) => {
    axios.get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename)
    })
  }

  const timeAgo = (date: Date | null | undefined): string => {
    if (!date) {
      return 'No submission date available';
    }
    const now = new Date().getTime();
    const time = new Date(date).getTime();
    console.log(new Date())
    console.log(date)
    const diff = now - time;
  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
  
    if (diff < minute) {
      return `Submitted just now`;
    } else if (diff < hour) {
      const minutesAgo = Math.floor(diff / minute);
      return `Submitted ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
      const hoursAgo = Math.floor(diff / hour);
      return `Submitted ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else if (diff < month) {
      const daysAgo = Math.floor(diff / day);
      return `Submitted ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else {
      const monthsAgo = Math.floor(diff / month);
      return `Submitted ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <>
      <Navbar />
      {isLoading || !entryID ?
        <LoadingImage src={LoadingIcon} alt='loading'/> : notFound ?
        <p> not found </p> :
        <>
          <ResultsContainer>
            <TopSection>
              <CourseCode>{info?.courseCode}</CourseCode>
              <Semester>{info?.semester}</Semester>
            </TopSection>
            <BottomSection>
              <EntryInfo><Bold>👨‍🏫 Professor:</Bold> {info?.professor}</EntryInfo>
              <EntryInfo><Bold>🎯 Course Average:</Bold> {info?.courseAverage}</EntryInfo>
              {info?.courseDelivery !== "" && <EntryInfo><Bold>📅 Course Delivery:</Bold> {info?.courseDelivery}</EntryInfo>}
              {info?.tutorials !== "" && <EntryInfo><Bold>📚 Tutorials:</Bold> {info?.tutorials}</EntryInfo>}
              {info?.groupProjects !== "" && <EntryInfo><Bold>👥 Group Projects:</Bold> {info?.groupProjects}</EntryInfo>}
              {info?.hasEssay !== "" && <EntryInfo><Bold>📝 Has Essay:</Bold> {info?.hasEssay}</EntryInfo>}
              {info?.autofail !== "" && <EntryInfo><Bold>⛔️ Exam Autofail:</Bold> {info?.autofail}</EntryInfo>}
              {info?.courseWebsite !== "" && <EntryInfo><Bold>🌐 Course Website:</Bold> <a href={info?.courseWebsite} target='_blank'>Link to website</a></EntryInfo>}
              {info?.otherNotes !== "" && <EntryInfo><Bold>📌 Other Notes:</Bold> {info?.otherNotes}</EntryInfo>}
              {info?.otherNotes !== "" && <EntryInfo><Bold>✅ Multiple Choice:</Bold> {info?.multipleChoice}</EntryInfo>}
            </BottomSection>
            <Button onClick={() => handleDownload(info?.syllabusLink!, `${info?.courseCode}_${info?.semester}_${info?.professor}.pdf`)}>Download Syllabus 📜</Button>
            <TimeAgo>{timeAgo(info?.postTime)}</TimeAgo>
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

const TopSection = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  border-bottom: 1px solid white;
  padding-bottom: 1rem;
`;

const CourseCode = styled.h2`
  margin: 0;
`;

const EntryInfo = styled.p`
  display: inline-flex;
  font-size: 20px;
  align-items: center;

  a {
    color: #00aeff;
    text-decoration: underline;
  }

  @media (max-width: 800px) {
    font-size: 18px;
  }
`;

const Semester = styled.p`
  margin: 0;
  font-size: 18px
`;

const TimeAgo = styled.p`
  float: right;
  padding-top: 0.5rem;
`;

const Bold = styled.div`
  font-weight: 600;
  margin-right: 0.5rem;
  color: #99c3f0;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  padding-top: 1rem;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-gap: 0rem;
  }
`;

const ResultsContainer = styled.div`
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

const Button = styled.button`
  grid-column: 1 / -1;
  background-color: #488ED8;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #ededee;
  cursor: pointer;
  display: inline-block;
  font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
  font-size: 22px;
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
  width: 100%;
  margin-top: 1rem;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const LoadingImage = styled(Image)`
  width: 50px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
`;

export default SearchPage;