import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import LoadingIcon from "../public/loading.svg";
import TrashIcon from '../public/trash.svg';
import { getAdvancedSearchResults } from '../utilities/api';
import { loadingState, userState } from '../utilities/atoms';
import { auth, firestore } from "../utilities/firebase";
import { getCourseEmoji, timeAgo } from "../utilities/helpers";
import { EntryResultInfoCompact, booleanOptions, courseAverageOptions, courseDeliveryOptions, multipleChoiceOptions, semesterDropdownOptions, tutorialOptions } from "../utilities/types";

// For react-multi-select-component MultiSelect 
interface Option {
  value: any;
  label: string;
  key?: string;
  disabled?: boolean;
}

const AdvancedSearch: NextPage = () => {
  const [courseCode, setCourseCode] = useState<string>('');
  const [professor, setProfessor] = useState<string>('');
  const [semester, setSemester] = useState<Option[]>([]);
  const [courseAverage, setCourseAverage] = useState<Option[]>([]);
  const [courseDelivery, setCourseDelivery] = useState<Option[]>([]);
  const [multipleChoice, setMultipleChoice] = useState<Option[]>([]);
  const [tutorials, setTutorials] = useState<Option[]>([]);
  const [autofail, setAutofail] = useState<Option[]>([]);
  const [hasEssay, setHasEssay] = useState<Option[]>([]);
  const [groupProjects, setGroupProjects] = useState<Option[]>([]);
  const [toggleFilters, setToggleFilters] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<EntryResultInfoCompact[]>([]);
  const [message, setMessage] = useState<string>('');

  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  
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

  const resetFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCourseCode('');
    setProfessor('');
    setSemester([]);
    setCourseAverage([]);
    setCourseDelivery([]);
    setMultipleChoice([]);
    setTutorials([]);
    setAutofail([]);
    setHasEssay([]);
    setGroupProjects([]);
  }

  const queryBuilder = () => {
    const queryConstraints = [];

    if (courseCode) {
      queryConstraints.push(where('courseCodeSearch', 'array-contains', courseCode));
    }

    if (semester.length > 0) {
      queryConstraints.push(where('semester', 'in', semester.map((item) => item.value)));
    }

    if (courseAverage.length > 0) {
      queryConstraints.push(where('courseAverage', 'in', courseAverage.map((item) => item.value)));
    }

    if (courseDelivery.length > 0) {
      queryConstraints.push(where('courseDelivery', 'in', courseDelivery.map((item) => item.value)));
    }

    if (multipleChoice.length > 0) {
      queryConstraints.push(where('multipleChoice', 'in', multipleChoice.map((item) => item.value)));
    }

    if (tutorials.length > 0) {
      queryConstraints.push(where('tutorials', 'in', tutorials.map((item) => item.value)));
    }

    if (autofail.length > 0) {
      queryConstraints.push(where('autofail', 'in', autofail.map((item) => item.value)));
    }
    
    if (groupProjects.length > 0) {
      queryConstraints.push(where('groupProjects', 'in', groupProjects.map((item) => item.value)));
    }

    if (hasEssay.length > 0) {
      queryConstraints.push(where('hasEssay', 'in', hasEssay.map((item) => item.value)));
    }

    const entriesRef = collection(firestore, 'entries');
    const q = query(entriesRef, ...queryConstraints);
    return q;
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const queryBuilderResults = queryBuilder();
    const advancedSearchResults = await getAdvancedSearchResults(queryBuilderResults);
    let results = []

    if (professor.trim() !== '') {
      const filteredResults = advancedSearchResults.filter((result) => {
        return result.professor.includes(professor);
      });
      results = filteredResults;
    } else {
      results = advancedSearchResults;
    }

    setSearchResults(results);
    if (results.length == 0) {
      setMessage("Your search returned no results 😢. Try something else.")
    }
    setToggleFilters(false);
    setIsLoading(false);
  };

  const goToInfoPage = (entryID: string) => {
    window.open(`/entry/${entryID}`, '_blank');
  };

  if (user) return (
    <>
      <Navbar />
      <MainContainer>
        <FilterToggleButton className={toggleFilters ? 'button-enabled' : 'button-disabled'} onClick={() => setToggleFilters(!toggleFilters)}>
          {toggleFilters ? 'Hide' : 'Show'} Filters
        </FilterToggleButton>
        <FormContainer onSubmit={handleSearch} className={toggleFilters ? 'enabled' : 'disabled'} style={{transition: "all 1s ease-in-out"}}>
          <Form.Group>
            <StyledFormLabel>Course Code</StyledFormLabel>
            <Form.Control
              type="search"
              placeholder="Search for courses by course codes"
              aria-label="Search"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
            />
          </Form.Group>
          <Form.Group>
            <StyledFormLabel>Professor</StyledFormLabel>
            <Form.Control
              type="search"
              placeholder="Find professors by name"
              aria-label="Search"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </Form.Group>
          <SelectGroup>
            <StyledFormLabel>Semester</StyledFormLabel>
            <MultiSelect
              options={semesterDropdownOptions}
              value={semester}
              onChange={setSemester}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Course Average</StyledFormLabel>
            <MultiSelect
              options={courseAverageOptions}
              value={courseAverage}
              onChange={setCourseAverage}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Course Delivery</StyledFormLabel>
            <MultiSelect
              options={courseDeliveryOptions}
              value={courseDelivery}
              onChange={setCourseDelivery}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Tutorials</StyledFormLabel>
            <MultiSelect
              options={tutorialOptions}
              value={tutorials}
              onChange={setTutorials}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Multiple Choice</StyledFormLabel>
            <MultiSelect
              options={multipleChoiceOptions}
              value={multipleChoice}
              onChange={setMultipleChoice}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Exam Autofail</StyledFormLabel>
            <MultiSelect
              options={booleanOptions}
              value={autofail}
              onChange={setAutofail}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Group Projects</StyledFormLabel>
            <MultiSelect
              options={booleanOptions}
              value={groupProjects}
              onChange={setGroupProjects}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <SelectGroup>
            <StyledFormLabel>Has Essay</StyledFormLabel>
            <MultiSelect
              options={booleanOptions}
              value={hasEssay}
              onChange={setHasEssay}
              labelledBy="Select"
              disableSearch
            />
          </SelectGroup>
          <ButtonGroup>
            <Button type='submit'>Search</Button>
            <Button onClick={(e: any) => resetFields(e)} style={{padding: '0.2rem', backgroundColor: "black", width: '10%', minWidth: '47px', marginLeft: '1rem'}}>
              <Image src={TrashIcon} width={30} height={30} alt="trash"
              />
            </Button>
          </ButtonGroup>
        </FormContainer>
        {
          isLoading ?
          <LoadingImage src={LoadingIcon} alt='loading'/> :
          message ?
          <div>
            <h4 style={{paddingTop: '1rem'}}>{message}</h4>
          </div> :
          <ResultContainer>
            {searchResults.map((entry, index) => {
              return (
                <ResultItem key={index} onClick={() => goToInfoPage(entry.id)}>
                  <h5>{getCourseEmoji(entry.courseCode.slice(0,3))} {entry.courseCode}</h5>
                  <h6>{entry.semester}</h6>
                  <TimeAgo>{timeAgo(entry?.postTime)}</TimeAgo>
                </ResultItem>
              )
            })}
          </ResultContainer>
        }
      </MainContainer>
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
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ResultItem = styled.div`
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

const SelectGroup = styled.div`
  color: black;
  min-width: 100%;
  h6 {
    color: white;
  }
`;

const MainContainer = styled.div`
  position: relative;
  display: flex;
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
  margin-top: 100px;
  width: 50px;
  height: auto;
`;

const FormContainer = styled(Form)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 70%;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    width: 90%;
  }
`;

const StyledFormLabel = styled.h6`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  padding-top: 1rem;
  display: flex;
`;

const Button = styled.button`
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

  &:disabled {
    border-color: #DDDDDD;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
  }
`;

const FilterToggleButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1rem 0;
  justify-content: center;
  background-color: #0A121E;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #ededee;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  outline: none;
  padding: 13px 23px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: 70%;

  @media (max-width: 800px) {
    width: 90%;
  }

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    background-color: #0A121E;
    border-color: #000000;
    transform: scale(.96);
  }

  &:hover {
    opacity: 0.9;
  }
`;

export default AdvancedSearch;