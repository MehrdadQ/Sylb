import { onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { doc, getDoc } from 'firebase/firestore';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import LoadingIcon from "../../public/loading.svg";
import { getUserInfo, requestEntryUpdate } from '../../utilities/api';
import { loadingState, userState } from '../../utilities/atoms';
import { auth, firestore } from '../../utilities/firebase';
import { EntryInfo } from "../../utilities/types";

const SuggestEditPage: React.FC = () => {
  const [file, setFile] = useState<File | undefined | null>(undefined);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [info, setInfo] = useState<EntryInfo>({
    courseCode: undefined,
    professor: undefined,
    semester: undefined,
    courseDelivery: undefined,
    tutorials: undefined,
    autofail: undefined,
    courseAverage: undefined,
    hasEssay: undefined,
    syllabusLink: undefined,
    groupProjects: undefined,
    courseWebsite: undefined,
    postTime: undefined,
    otherNotes: undefined,
    multipleChoice: undefined,
    campus: undefined,
  });
  const [oldInfo, setOldInfo] = useState<EntryInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { entryID: entryID } = router.query as { entryID: string };

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
    const getEntryById = async (entryId: string) => {
      const entryRef = doc(firestore, 'entries', entryId);
    
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
      setInfo(data as EntryInfo);
      setOldInfo(data as EntryInfo)
      setIsLoading(false);
      return data;
    };
    setIsLoading(true);
    if (entryID) {
      getEntryData();
    }
  }, [entryID, setIsLoading]);

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

  function filterUnchangedFields<T>(obj: T): T {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key as keyof T];
        if (value === undefined) {
          obj[key as keyof T] = '' as any;
        }
      }

      if (oldInfo && obj[key] == oldInfo[key as keyof typeof oldInfo]) {
        delete obj[key]
      }
    }
    return obj;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    let updatedCourseData: any = {};
    try {
      if (file) {
        const downloadURL = await handleFileUpload();
        if (!downloadURL) {
          throw new Error();
        }
        updatedCourseData =
          filterUnchangedFields({ ...info, postTime: new Date().getTime(), syllabusLink: downloadURL, entryID: entryID });
      } else {
        updatedCourseData =
          filterUnchangedFields({ ...info, postTime: new Date().getTime(), entryID: entryID });
      }
        
      await requestEntryUpdate(updatedCourseData);
    }

    catch (e: any) {
      toastError("Something went wrong. Please try again.")
      setIsLoading(false);
      return;
    }
    setShowSuccess(true)
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError("File size exceeds the limit. Please upload a file up to 5MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setFile(file);
      }
    } else {
      setFile(undefined)
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        return downloadURL;
      } catch (e: any) {
        toastError("Something went wrong with the file upload 😞. Please try again.")
      }
    }
  };

  const canSubmit = () => {
    return JSON.stringify(info) !== JSON.stringify(oldInfo);
  };

  return (
    <>
      <NextSeo
        title={info ? `${info.courseCode} - Edit` : "Sylb"}
        description={`Suggest edits to this ${info.courseCode} entry.`}
      />
      <Navbar />
      {isLoading || !entryID ?
        <LoadingImage src={LoadingIcon} alt='loading'/> : notFound ?
        <NotFound>
          <p>Oops! This link seems to be broken.</p>
          <p>It&apos;s possible the submission was deleted or is no longer available. Feel free to try a search instead.</p>
        </NotFound> : showSuccess ? 
        <SuccessMsg>
          <h3>Thanks for your edit suggestion! Your request will be manually reviewed and the appropriate changes will be made ASAP!</h3>
        </SuccessMsg> :
        <MainContainer>
          <ExistingDataContainer onSubmit={handleSubmit}>
            <SingleColumnFormGroup>
              <h3>Suggesting Edits for <span>{info.courseCode}</span> with <span>{info.professor}</span> during <span>{info.semester}</span></h3>
            </SingleColumnFormGroup>
              <Form.Group controlId="courseAverage">
                <StyledFormLabel>Course Average <span>{info.courseAverage !== oldInfo?.courseAverage && '(UPDATED)'}</span></StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={info?.courseAverage}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInfo({ ...info, courseAverage: value as EntryInfo['courseAverage'] });
                  }}    
                >
                  <option value="">What was the course average?</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="D-">D-</option>
                  <option value="In progress">In progress</option>
                  <option value="">Not sure...</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="courseDelivery">
              <StyledFormLabel>Course Delivery <span>{info.courseDelivery !== oldInfo?.courseDelivery && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Select
                size='sm'
                value={info?.courseDelivery}
                onChange={(e) => {
                  const value = e.target.value;
                  setInfo({ ...info, courseDelivery: value as EntryInfo['courseDelivery']});
                }}    
              >
                <option value="">What was the course delivery type?</option>
                <option value="In-person">In-person</option>
                <option value="In-person with Recorded Lectures">In-person with Recorded Lectures</option>
                <option value="Online Synchronous">Online Synchronous</option>
                <option value="Online Synchronous (Recorded)">Online Synchronous (Recorded)</option>
                <option value="Online Asynchronous">Online Asynchronous</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="tutorials">
              <StyledFormLabel>Tutorials <span>{info.tutorials !== oldInfo?.tutorials && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Select
                size='sm'
                value={info?.tutorials}
                onChange={(e) => {
                  const value = e.target.value;
                  setInfo({ ...info, tutorials: value as EntryInfo['tutorials']});
                }}
              >
                <option value="">Select tutorial type</option>
                <option value="Mandatory">Mandatory</option>
                <option value="Optional but recommended">Optional but recommended</option>
                <option value="Optional">Optional</option>
                <option value="No Tutorials">No Tutorials</option>
              </Form.Select>
            </Form.Group>

            <Form.Group  controlId="syllabusFile">
              <StyledFormLabel>New Syllabus File <span>{file !== undefined && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Control type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" />
            </Form.Group>

            <Form.Group controlId="autofail">
              <StyledFormLabel>Autofail <span>{info.autofail !== oldInfo?.autofail && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Select
                size='sm'
                value={info?.autofail}
                onChange={(e) => {
                  const value = e.target.value;
                  setInfo({ ...info, autofail: value as EntryInfo["autofail"] });
                }}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Final Exam">No Final Exam</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="hasEssay">
              <StyledFormLabel>Essays <span>{info.hasEssay !== oldInfo?.hasEssay && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Select
                size='sm'
                value={info?.hasEssay}
                onChange={(e) => {
                  const value = e.target.value;
                  setInfo({ ...info, hasEssay: value as EntryInfo["hasEssay"] });
                }}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="groupProjects">
              <StyledFormLabel>Group Projects <span>{info.groupProjects !== oldInfo?.groupProjects && '(UPDATED)'}</span></StyledFormLabel>
              <InputGroup>
                <Form.Select
                  size='sm'
                  value={info?.groupProjects}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInfo({ ...info, groupProjects: value as EntryInfo["groupProjects"]  });
                  }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="groupProjects">
              <StyledFormLabel>Multiple Choice <span>{info.multipleChoice !== oldInfo?.multipleChoice && '(UPDATED)'}</span></StyledFormLabel>
              <InputGroup>
                <Form.Select
                  size='sm'
                  value={info?.multipleChoice}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInfo({ ...info, multipleChoice: value as EntryInfo['multipleChoice']});
                  }}
                >
                  <option value="">Select</option>
                  <option value="All questions">All questions</option>
                  <option value="Some questions">Some questions</option>
                  <option value="None">None</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="courseWebsite">
              <StyledFormLabel>Course Website <span>{info.courseWebsite !== oldInfo?.courseWebsite && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Control
                placeholder='Enter course website if there is one'
                size='sm'
                type="text"
                name="courseWebsite"
                value={info?.courseWebsite}
                onChange={(e) => setInfo({ ...info, courseWebsite: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="otherNotes">
              <StyledFormLabel>Other Notes <span>{info.otherNotes !== oldInfo?.otherNotes && '(UPDATED)'}</span></StyledFormLabel>
              <Form.Control
                placeholder='Anything else others should know?'
                size='sm'
                type="text"
                name="otherNotes"
                value={info?.otherNotes}
                onChange={(e) => setInfo({ ...info, otherNotes: e.target.value })}
              />
            </Form.Group>
            <Button disabled={!canSubmit()}>Submit</Button>
          </ExistingDataContainer>
        </MainContainer>
      }
    </>
  );
};


const ExistingDataContainer = styled(Form)`
  padding: 1rem 4rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  width: 70%;
  
  @media (max-width: 1200px) {
    padding: 1rem 3rem;
    grid-template-columns: repeat(3, 1fr);
    width: 80%;
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 800px) {
    padding: 0.5rem 1rem;
    width: 100%;
    padding-bottom: 2rem;
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
  }
  
  h3 {
    width: 100%;
    
    span {
      color: #55b8e6;
    }
  }
`;

const MainContainer = styled.div`
  color: #EDEDEE;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #2D3748;
`;

const SingleColumnFormGroup = styled(Form.Group)`
  grid-column: 1 / -1;
`;

const StyledFormLabel = styled(Form.Label)`
  font-weight: bold;

  span {
    color: #ffc50f;
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
`;

const LoadingImage = styled(Image)`
  width: 50px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
`;

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem;

  h3 {
    width: 60%;
  }

  @media (max-width: 1200px) {
    padding: 4rem;
    h3 {
      width: 90%;
    }
  }
  
  @media (max-width: 600px) {
    padding: 2rem;
    h3 {
      width: 100%;
    }
  }
`;

export default SuggestEditPage;
