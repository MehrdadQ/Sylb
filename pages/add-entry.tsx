import { onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import LoadingIcon from "../public/loading.svg";
import { addCourseEntry } from '../utilities/api';
import { loadingState, userState } from '../utilities/atoms';
import { auth } from '../utilities/firebase';
import { CourseData } from "../utilities/types";

const semesterOptions = [
  'Winter 2024',
  'Summer 2024',
  'Fall 2024',
  'Winter 2023',
  'Summer 2023',
  'Fall 2023',
  'Winter 2022',
  'Summer 2022',
  'Fall 2022',
  'Winter 2021',
  'Summer 2021',
  'Fall 2021',
  'Winter 2020',
  'Summer 2020',
  'Fall 2020',
  'Winter 2019',
  'Summer 2019',
  'Fall 2019',
  'Winter 2018',
  'Summer 2018',
  'Fall 2018',
  'Winter 2017',
  'Summer 2017',
  'Fall 2017',
  'Winter 2016',
  'Summer 2016',
  'Fall 2016',
  'Winter 2015',
  'Older'
];

const AddEntryPage: React.FC = () => {
  const [file, setFile] = useState<File | undefined | null>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courseData, setCourseData] = useState<CourseData>({
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
    postTime: null,
    otherNotes: ''
  });

  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUser(uid)
      } else {
        goToLogin();
      }
    });
  }, [setUser])

  const goToLogin = () => {
    router.push("/login")
  }

  const canAdvance = (currentPage: number) => {
    if (currentPage === 1) {
      const { courseCode, semester, professor, courseAverage, courseDelivery, tutorials } = courseData;
      return courseCode !== undefined && semester !== undefined && professor !== undefined && 
        courseAverage !== undefined && courseDelivery !== undefined && tutorials !== undefined;
    }
    if (currentPage === 2) {
      const { autofail, hasEssay, groupProjects } = courseData;
      return autofail !== undefined && hasEssay !== undefined && groupProjects !== undefined && 
        file !== undefined && file !== null;
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
      tutorials: undefined,
      autofail: undefined,
      courseAverage: undefined,
      hasEssay: undefined,
      syllabusLink: '',
      groupProjects: undefined,
      courseWebsite: '',
      postTime: null,
      otherNotes: ''
    });
    setFile(undefined);
    setCurrentPage(1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      const downloadURL = await handleFileUpload();
      if (!downloadURL) {
        throw new Error();
      }
      const updatedCourseData = { ...courseData, postTime: new Date(), syllabusLink: downloadURL };
      await addCourseEntry(updatedCourseData);
    }

    catch (e: any) {
      toastError("Something went wrong. Please try again.")
      setIsLoading(false);
      return;
    }
    toastSuccess("Added successfully! 🎉")
    goNextPage(null);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFile(file);
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

  const goNextPage = (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (currentPage === 1) {
      const regex = /^[A-Z]{3}[A-Z0-9]{3,5}$/;
      if (!regex.test(courseData.courseCode)) {
        toastError("Oops! It looks like the course code might be incorrect. \
          Take a moment to double-check and make sure it's entered correctly.");
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
                <StyledFormLabel>Course Code</StyledFormLabel>
                <Form.Control
                  placeholder='Enter Course Code'
                  size='sm'
                  type="text"
                  name="courseCode"
                  value={courseData.courseCode}
                  onChange={(e) => setCourseData({ ...courseData, courseCode: (e.target.value).toUpperCase() })}
                />
              </Form.Group>

              <Form.Group controlId="semester">
                <StyledFormLabel>Semester</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.semester}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, semester: parsedValue });
                  }}
                >
                  <option value="undefined">When did you take this course?</option>
                  {semesterOptions.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="professor">
                <StyledFormLabel>Professor</StyledFormLabel>
                <Form.Control
                  placeholder='Enter Professor Full Name'
                  size='sm'
                  type="text"
                  name="professor"
                  value={courseData.professor}
                  onChange={(e) => setCourseData({ ...courseData, professor: e.target.value })}
                />
              </Form.Group>
              
              <Form.Group controlId="courseAverage">
                <StyledFormLabel>Course Average</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.courseAverage}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, courseAverage: parsedValue as CourseData['courseAverage'] });
                  }}    
                >
                  <option value="undefined">What was the course average?</option>
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
                    setCourseData({ ...courseData, courseDelivery: parsedValue as CourseData['courseDelivery']});
                  }}    
                >
                  <option value="undefined">What was the course delivery type?</option>
                  <option value="In-person">In-person</option>
                  <option value="In-person with Recorded Lectures">In-person with Recorded Lectures</option>
                  <option value="Online Synchronous">Online Synchronous</option>
                  <option value="Online Asynchronous">Online Asynchronous</option>
                  <option value="I Don't remember">I Don&apos;t remember</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="tutorials">
                <StyledFormLabel>Tutorials</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.tutorials}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value;
                    setCourseData({ ...courseData, tutorials: parsedValue as CourseData['tutorials']});
                  }}
                >
                  <option value="undefined">Select tutorial type</option>
                  <option value="Mandatory">Mandatory</option>
                  <option value="Optional but recommended">Optional but recommended</option>
                  <option value="Optional">Optional</option>
                  <option value="No Tutorials">No Tutorials</option>
                  <option value="I Don't remember">I Don&apos;t remember</option>
                </Form.Select>
              </Form.Group>
            </>
          }

          {currentPage === 2 &&
            <>
              <SingleColumnFormGroup  controlId="syllabusFile">
                <StyledFormLabel>Syllabus File (PDF or DOCX)</StyledFormLabel>
                <Form.Control type="file" onChange={handleFileChange} accept=".pdf,.docx" />
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="autofail">
                <StyledFormLabel>Did the final exam have an autofail?</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.autofail ? courseData.autofail.toString() : undefined}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value === 'true';
                    setCourseData({ ...courseData, autofail: parsedValue });
                  }}
                >
                  <option value="undefined">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </SingleColumnFormGroup>

              <SingleColumnFormGroup controlId="hasEssay">
                <StyledFormLabel>Did you have to write an essay for this course?</StyledFormLabel>
                <Form.Select
                  size='sm'
                  value={courseData.hasEssay ? courseData.hasEssay.toString() : undefined}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === "undefined" ? undefined : value === 'true';
                    setCourseData({ ...courseData, hasEssay: parsedValue });
                  }}
                >
                  <option value="undefined">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
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
                      const parsedValue = value === "undefined" ? undefined : value === 'true';
                      setCourseData({ ...courseData, groupProjects: parsedValue });
                    }}
                  >
                    <option value="undefined">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Form.Select>
                </InputGroup>
              </SingleColumnFormGroup>
            </>
          }

          {currentPage === 3 &&
            <>
              <SingleColumnFormGroup controlId="courseWebsite">
                <StyledFormLabel>Course Website (optional)</StyledFormLabel>
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
                <StyledFormLabel>Any other notes or comments? (optional)</StyledFormLabel>
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
    </>
  );
};

const FormContainer = styled(Form)`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  width: 70%;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    width: 90%;
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
`


export default AddEntryPage;
