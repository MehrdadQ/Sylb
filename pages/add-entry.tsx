import { onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Form, InputGroup, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import LoadingIcon from "../public/loading.svg";
import { addCourseEntry, getUserInfo, updateUserCredits } from '../utilities/api';
import { loadingState, userState } from '../utilities/atoms';
import { auth, firestore } from '../utilities/firebase';
import { EntryInfo, courseAverageSorting, semesterOptions, semesterSorting } from "../utilities/types";

const AddEntryPage: React.FC = () => {
  const [file, setFile] = useState<File | undefined | null>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courseData, setCourseData] = useState<EntryInfo>({
    courseCode: '',
    professor: '',
    semester: undefined,
    courseDelivery: undefined,
    tutorials: undefined,
    autofail: undefined,
    courseAverage: undefined,
    hasEssay: undefined,
    syllabusLink: '',
    groupProjects: undefined,
    courseWebsite: '',
    postTime: undefined,
    otherNotes: '',
    multipleChoice: undefined,
    campus: undefined,
  });
  const [duplicateID, setDuplicateID] = useState<string|null>(null);
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [setUser])
  
  useEffect(() => {
    if (!hasVisitedBefore()) {
      setShowModal(true);
      localStorage.setItem('visited', 'true');
    }
  }, []);

  const hasVisitedBefore = () => {
    return localStorage.getItem('visited') === 'true';
  }

  const goToEntry = (entryID: string | null) => {
    if (entryID) {
      window.open(`/entry/${entryID}`, '_blank');
    }
  };
  const goToEdit = (entryID: string | null) => {
    if (entryID) {
      window.open(`/suggest-edit/${entryID}`, '_blank');
    }
  };

  const canAdvance = (currentPage: number) => {
    if (currentPage === 1) {
      const { courseCode, semester, professor, campus } = courseData;
      return courseCode !== '' && semester !== undefined && professor !== '' && 
        campus !== undefined;
    }
    if (currentPage === 2) {
      return file !== undefined && file !== null;
    }
    if (currentPage === 3) {
      return true;
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

  const resetFields = (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    setCourseData({
      courseCode: '',
      professor: '',
      semester: undefined,
      courseDelivery: undefined,
      courseAverage: undefined,
      tutorials: undefined,
      autofail: undefined,
      hasEssay: undefined,
      syllabusLink: '',
      groupProjects: undefined,
      courseWebsite: '',
      postTime: undefined,
      otherNotes: '',
      multipleChoice: undefined,
      campus: undefined,
    });
    setFile(undefined);
    setCurrentPage(1);
  }

  function replaceUndefinedWithEmptyString<T>(obj: T): T {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key as keyof T];
        if (value === undefined) {
          obj[key as keyof T] = '' as any;
        }
      }
    }
    return obj;
  }

  const generateSubstrings = (str: string) => {
    const substrings: { [key: string]: boolean } = {};
    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j <= str.length; j++) {
        const substring = str.slice(i, j);
        substrings[substring] = true;
      }
    }
    return substrings;
  };  

  const generateSubstringsProfessorName = (str: string) => {
    const substrings: string[] = [];
    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j <= str.length; j++) { 
        const substring = str.slice(i, j);
        if (!substring.includes(' ') && (!i || str[i - 1] === ' ')) {
          substrings.push(substring);
        }
      } 
    }
    return Array.from(new Set(substrings)); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      const downloadURL = await handleFileUpload();
      if (!downloadURL) {
        throw new Error();
      }
      
      const updatedCourseData: EntryInfo =
        replaceUndefinedWithEmptyString(
          { ...courseData,
            postTime: new Date().getTime(),
            syllabusLink: downloadURL,
            courseCodeSearch: generateSubstrings(courseData.courseCode!),
            professorSearch: generateSubstringsProfessorName(courseData.professor!),
            semesterNumValue: semesterSorting[courseData.semester as keyof typeof semesterSorting],
            courseAverageNumValue: courseAverageSorting[courseData.courseAverage as keyof typeof courseAverageSorting],
            submittedBy: user?.uid
          }
        );

      const newEntryUid = await addCourseEntry(user?.uid!, updatedCourseData);
      await updateUserCredits(user?.uid!, user?.credits! + 1);
      setUser((prevUser) => ({
        ...prevUser!,
        credits: user?.credits! + 1,
        hasAccessTo: [...(prevUser!.hasAccessTo ?? []), newEntryUid],
      }));
    }

    catch (e: any) {
      toastError("Something went wrong. Please try again.")
      setIsLoading(false);
      return;
    }
    toastSuccess(`Added successfully! 🎉 You now have ${user?.credits! + 1} credits!`);
    goNextPage(null);
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

  const alreadyExists = async () => {
    const { courseCode, semester, professor } = courseData;
    const entriesRef = collection(firestore, 'entries');
    const q = query(entriesRef, 
      where('courseCode', '==', courseCode),
      where('semester', '==', semester),
      where('professor', '==', professor)
    );

    try {
      const snapshot = await getDocs(q);
      const isDuplicate = snapshot.docs.length > 0;
      if (isDuplicate) {
        setDuplicateID(snapshot.docs[0].id);
        return true;
      }
    } catch (error) {
      console.error('Error searching for duplicates:', error);
    }
    return false;
  };

  
  const goNextPage = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (currentPage === 1) {
      const regex = /^[A-Z]{3}[A-Z0-9]{3,5}$/;
      if (courseData.courseCode && !regex.test(courseData.courseCode)) {
        toastError("Oops! It looks like the course code might be incorrect. \
          Take a moment to double-check and make sure it's entered correctly.");
        return;
      }

      if (await alreadyExists()) {
        return;
      }
    }
    setCurrentPage(currentPage + 1)
  }
  
  const goPreviousPage = (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    setCurrentPage(currentPage - 1)
  }

  return (
    <>
      <Navbar />
      <Container>
        <FormContainer onSubmit={handleSubmit}>
          {currentPage === 1 &&
            <>
              <Form.Group controlId="courseCode">
                <StyledFormLabel>Course Code *</StyledFormLabel>
                <Form.Control
                  placeholder='Enter Course Code (requried)'
                  size='sm'
                  type="text"
                  name="courseCode"
                  value={courseData.courseCode}
                  onChange={(e) => setCourseData({ ...courseData, courseCode: (e.target.value).toUpperCase() })}
                />
              </Form.Group>

              <Form.Group controlId="semester">
                <StyledFormLabel>Semester *</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.semester}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, semester: parsedValue });
                  }}
                >
                  <option value="undefined">When did you take this course? (requried)</option>
                  {semesterOptions.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="professor">
                <StyledFormLabel>Professor *</StyledFormLabel>
                <Form.Control
                  placeholder='Enter Professor Full Name (requried)'
                  size='sm'
                  type="text"
                  name="professor"
                  value={courseData.professor}
                  onChange={(e) => setCourseData({ ...courseData, professor: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="campus">
                <StyledFormLabel>Campus *</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.campus}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, campus: parsedValue as EntryInfo['campus']});
                  }}
                >
                  <option value="undefined">Select campus</option>
                  <option value="UTSG">UTSG</option>
                  <option value="UTSC">UTSC</option>
                  <option value="UTM">UTM</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group controlId="courseAverage">
                <StyledFormLabel>Course Average</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.courseAverage}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value === "null" ? null : value;
                    setCourseData({ ...courseData, courseAverage: parsedValue as EntryInfo['courseAverage'] });
                  }}    
                >
                  <option value="null">What was the course average?</option>
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
                  <option value="undefined">Not sure...</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="courseDelivery">
                <StyledFormLabel>Course Delivery</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.courseDelivery}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, courseDelivery: parsedValue as EntryInfo['courseDelivery']});
                  }}    
                >
                  <option value="undefined">What was the course delivery type?</option>
                  <option value="In-person">In-person</option>
                  <option value="In-person with Recorded Lectures">In-person with Recorded Lectures</option>
                  <option value="Online Synchronous">Online Synchronous</option>
                  <option value="Online Synchronous (Recorded)">Online Synchronous (Recorded)</option>
                  <option value="Online Asynchronous">Online Asynchronous</option>
                </Form.Select>
              </Form.Group>
            </>
          }

          {currentPage === 2 &&
            <>
              <SingleColumnFormGroup  controlId="syllabusFile">
                <StyledFormLabel>Syllabus File (PDF or DOCX) *</StyledFormLabel>
                <Form.Control type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" />
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="autofail">
                <StyledFormLabel>Did the final exam have an autofail?</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.autofail ? courseData.autofail.toString() : undefined}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, autofail: parsedValue as EntryInfo["autofail"] });
                  }}
                >
                  <option value="undefined">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="No Final Exam">No Final Exam</option>
                </Form.Select>
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="hasEssay">
                <StyledFormLabel>Did you have to write an essay for this course?</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.hasEssay ? courseData.hasEssay.toString() : undefined}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value
                    setCourseData({ ...courseData, hasEssay: parsedValue as EntryInfo["hasEssay"] });
                  }}
                >
                  <option value="undefined">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="groupProjects">
                <StyledFormLabel>Did this course have group projects?</StyledFormLabel>
                <InputGroup>
                  <Form.Select
                    size='sm'
                    value={courseData.groupProjects ? courseData.groupProjects.toString() : undefined}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedValue = value === "undefined" ? undefined : value;
                      setCourseData({ ...courseData, groupProjects: parsedValue as EntryInfo["groupProjects"]  });
                    }}
                  >
                    <option value="undefined">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </InputGroup>
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="groupProjects">
                <StyledFormLabel>Were the questions on tests/exams multiple choice?</StyledFormLabel>
                <InputGroup>
                  <Form.Select
                    size='sm'
                    value={courseData.multipleChoice ? courseData.multipleChoice.toString() : undefined}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedValue = value === "undefined" ? undefined : value;
                      setCourseData({ ...courseData, multipleChoice: parsedValue as EntryInfo['multipleChoice']});
                    }}
                  >
                    <option value="undefined">Select</option>
                    <option value="All questions">All questions</option>
                    <option value="Some questions">Some questions</option>
                    <option value="None">None</option>
                  </Form.Select>
                </InputGroup>
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="tutorials">
                <StyledFormLabel>What were the tutorial/practical/lab types?</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.tutorials}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, tutorials: parsedValue as EntryInfo['tutorials']});
                  }}
                >
                  <option value="undefined">Select</option>
                  <option value="Mandatory">Mandatory</option>
                  <option value="Optional but recommended">Optional but recommended</option>
                  <option value="Optional">Optional</option>
                  <option value="No Tutorials">No Tutorials</option>
                </Form.Select>
              </SingleColumnFormGroup>
            </>
          }

          {currentPage === 3 &&
            <>
              <SingleColumnFormGroup controlId="courseWebsite">
                <StyledFormLabel>Course Website</StyledFormLabel>
                <Form.Control
                  placeholder='Enter course website if there is one'
                  size='sm'
                  type="text"
                  name="courseWebsite"
                  value={courseData.courseWebsite}
                  onChange={(e) => setCourseData({ ...courseData, courseWebsite: e.target.value })}
                />
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="otherNotes">
                <StyledFormLabel>Any other notes or comments?</StyledFormLabel>
                <Form.Control
                  placeholder='Anything else others should know?'
                  size='sm'
                  type="text"
                  name="otherNotes"
                  value={courseData.otherNotes}
                  onChange={(e) => setCourseData({ ...courseData, otherNotes: e.target.value })}
                />
              </SingleColumnFormGroup>
            </>
          }

          {currentPage === 4 ?
            <>
              <Centered>Thanks for your contribution!</Centered>
              <ButtonContainer>
                <Button onClick={resetFields}>Submit another entry</Button>
              </ButtonContainer>
            </> :
            currentPage === 3 ?
            <ButtonContainer>
              <NavigationButton onClick={goPreviousPage} style={{backgroundColor: "#0A121E", color: "#ededee"}}>
                Back
              </NavigationButton>
              <Button type="submit" disabled={!canAdvance(currentPage)}>
                {isLoading ?
                  <Image src={LoadingIcon} alt='loading' style={{width: "18px", height: 'auto'}}/>
                : <>Submit</>
                }
              </Button>
            </ButtonContainer> :
            <ButtonContainer>
              {currentPage - 1 > 0 &&
                <NavigationButton onClick={goPreviousPage} style={{backgroundColor: "#0A121E", color: "#ededee"}}>
                  Back
                </NavigationButton>
              }
              <NavigationButton onClick={goNextPage} style={{marginLeft: "auto"}} disabled={!canAdvance(currentPage)}>
                Next
              </NavigationButton>
            </ButtonContainer>
          }
        </FormContainer>
      </Container>
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
      <Modal
        show={duplicateID !== null}
        onHide={() => setDuplicateID(null)}
        centered
        style={{color: 'black'}}
      >
        <Modal.Body>
          An entry for <TextBold>{courseData.courseCode}</TextBold> with <TextBold>{courseData.professor}</TextBold>{' '}
          for <TextBold>{courseData.semester}</TextBold> already exists.
          You can access it <NavLink onClick={() => goToEntry(duplicateID)}>HERE.</NavLink>
          <br/><br/>If you think the information on that page is not accurate, you can make edit requests{' '}
          <NavLink onClick={() => goToEdit(duplicateID)}>HERE.</NavLink>
        </Modal.Body>
      </Modal>
      <MessageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton className='styled'>
          <Modal.Title>Hey there! 👋 </Modal.Title>
        </Modal.Header>
        <Modal.Body className='styled'>
          Your contributions are much appreciated! Please make sure the info you enter is accurate and helpful for fellow
          students considering taking this course. Happy sharing! 😊🎉
        </Modal.Body>
      </MessageModal>
    </>
  );
};

const MessageModal = styled(Modal)`
  .styled {
    background-color: #2D3748;
    color: #ededee;
  }
`;

const FormContainer = styled(Form)`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  width: 50%;

  @media (max-width: 1500px) {
    width: 70%;
  }

  @media (max-width: 800px) {
    padding: 1rem;
    width: 100%;
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;

const Centered = styled.div`
  font-size: 23px;
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: center;
  @media (max-width: 800px) {
    font-size: 18px;
  }
`;

const Container = styled.div`
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

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledFormLabel = styled(Form.Label)`
  font-weight: bold;
`;

const NavigationButton = styled.button`
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
  width: 20%;
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

  @media (max-width: 800px) {
    width: 100%;
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

const NavLink = styled.a`
  color: #2792c4;
  cursor: pointer;
`;

const TextBold = styled.div`
  font-weight: 600;
  display: inline-block;
`;


export default AddEntryPage;
