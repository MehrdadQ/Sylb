import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/storage';
import fileDownload from 'js-file-download';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import EditIcon from "../../public/edit.svg";
import LoadingIcon from "../../public/loading.svg";
import ReportIcon from "../../public/report.svg";
import { getEntryById, getUserInfo, requestEntryUpdate } from '../../utilities/api';
import { loadingState, userState } from '../../utilities/atoms';
import { auth } from '../../utilities/firebase';
import { getCourseEmoji, timeAgo } from '../../utilities/helpers';
import { EntryResultInfo } from '../../utilities/types';


const SearchPage = () => {
  const router = useRouter();
  const [info, setInfo] = useState<EntryResultInfo | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [reportMessage, setReportMessage] = useState<string>("");
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  const { entryID: entryID } = router.query as { entryID: string };

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
    setIsLoading(true);
    if (entryID) {
      getEntryData();
    }
  }, [entryID]);

  const reportEntry = async () => {
    setIsLoading(true);
    await requestEntryUpdate({
      entryID: entryID,
      otherNotes: `REPORT: ${reportMessage}`
    });
    setIsLoading(false);
    setShowReportModal(false);
    toastSuccess("Thank you for reporting this submission! We will review this entry ASAP!")
  }

  const goToEdit = (id: string) => {
    router.push(`/suggest-edit/${id}`)
  }

  const toastSuccess = (message: string) => {
    toast.success(message, {
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

  const getEntryData = async () => {
    const data = await getEntryById(entryID);
    if (data === undefined) {
      setNotFound(true);
      setIsLoading(false);
    } else if (data === null) {
      toastError("Something went wrong. Please try again.")
      setIsLoading(false);
    } else {
      setInfo(data as EntryResultInfo);
      setIsLoading(false);
      return data;
    }
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

  const handleDownload = (url: string, filename: string) => {
    axios.get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename)
    })
  }

  return (
    <>
      <Navbar />
      {(isLoading && !showReportModal) || !entryID ?
        <LoadingImage src={LoadingIcon} alt='loading'/> : notFound ?
        <NotFound>
          <p>Oops! This link seems to be broken.</p>
          <p>It&apos;s possible the submission was deleted or is no longer available. Feel free to try a search instead.</p>
        </NotFound> :
        <>
          <ResultsContainer>
            <TopSection>
              <CourseCode>{info?.courseCode} {getCourseEmoji(info?.courseCode.slice(0, 3))}</CourseCode>
              <Semester>{info?.semester}</Semester>
            </TopSection>
            <BottomSection>
              <EntryInfo><Bold>👨‍🏫 Professor:</Bold> {info?.professor}</EntryInfo>
              {info?.courseAverage !== "" && <EntryInfo><Bold>🎯 Course Average:</Bold> {info?.courseAverage}</EntryInfo>}
              {info?.courseDelivery !== "" && <EntryInfo><Bold>📅 Course Delivery:</Bold> {info?.courseDelivery}</EntryInfo>}
              {info?.tutorials !== "" && <EntryInfo><Bold>📚 Tutorials:</Bold> {info?.tutorials}</EntryInfo>}
              {info?.groupProjects !== "" && <EntryInfo><Bold>👥 Group Projects:</Bold> {info?.groupProjects}</EntryInfo>}
              {info?.hasEssay !== "" && <EntryInfo><Bold>📝 Essays:</Bold> {info?.hasEssay}</EntryInfo>}
              {info?.autofail !== "" && <EntryInfo><Bold>⛔️ Exam Autofail:</Bold> {info?.autofail}</EntryInfo>}
              {info?.multipleChoice !== "" && <EntryInfo><Bold>✅ Multiple Choice:</Bold> {info?.multipleChoice}</EntryInfo>}
              {info?.courseWebsite !== "" && <EntryInfo><Bold>🌐 Course Website:</Bold> <a href={info?.courseWebsite} target='_blank'>Link to website</a></EntryInfo>}
              {info?.otherNotes !== "" && <EntryInfo><Bold>📌 Other Notes:</Bold> {info?.otherNotes}</EntryInfo>}
            </BottomSection>
            <Button onClick={() => handleDownload(info?.syllabusLink!, `${info?.courseCode}_${info?.semester}_${info?.professor}.pdf`)}>
              Download Syllabus 📜
            </Button>
            <Footer>
              <div style={{display: "inline-flex"}}>
                <LinkButton onClick={() => goToEdit(entryID)}>
                  <Image src={EditIcon} alt='loading' style={{width: "18px", height: 'auto'}}/>
                  <p style={{color: '#7bb2ec'}}>Suggest edits</p>

                </LinkButton>
                <LinkButton style={{marginLeft: '1rem'}} onClick={() => setShowReportModal(true)}>
                  <Image src={ReportIcon} alt='loading' style={{width: "18px", height: 'auto'}}/>
                  <p style={{color: '#e95353'}}>
                    Report
                  </p>
                </LinkButton>
              </div>
              <p>{timeAgo(info?.postTime!)}</p>
            </Footer>
          </ResultsContainer>
          <MessageModal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
            <Modal.Header closeButton className='styled'>
              <Modal.Title>Report submission</Modal.Title>
            </Modal.Header>
            <Modal.Body className='styled'>
              <Form>
                <Form.Group controlId='reportMessage'>
                  <Form.Label>Report Message:</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter your report message...'
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className='styled' style={{display: "flex", justifyContent: "center"}}>
              <Button onClick={reportEntry} style={{width: "200px", fontSize: "14px"}}>
                {isLoading ?
                  <Image src={LoadingIcon} alt='loading' style={{width: "18px", height: 'auto'}}/>
                : <>Submit Report</>
                }
              </Button>
            </Modal.Footer>
          </MessageModal>
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
  flex-wrap: wrap;

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

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;

  p {
    font-size: 30px;
    width: 60%;
  }

  @media (max-width: 1000px) {
    padding: 1rem;

    p {
      font-size: 20px;
      width: 90%;
    }
  }
`

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
  font-size: 20px;
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;

  p {
    padding-top: 0.5rem;
  }
  
  .link {
    padding-top: 0.5rem;
    color: #7bb2ec;
    cursor: pointer;
  }

  @media (max-width: 500px) {
    flex-direction: column-reverse;
    .link {
      padding: 0;
      margin: 0;
    }
    
    p {
      padding-top: 1rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const MessageModal = styled(Modal)`
  .styled {
    background-color: #2D3748;
    color: #ededee;
  }
`;

const LinkButton = styled.div`
  display: flex;
  align-items: stretch;
  cursor: pointer;

  p {
    margin: 0;
    margin-left: 5px;
    padding: 0;
  }
`;

export default SearchPage;