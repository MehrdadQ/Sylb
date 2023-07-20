import router from 'next/router';
import styled from 'styled-components';

type ResultItemProps = {
  courseCode: string,
  professor: string,
  semester: string,
  backgroundColor?: string
  entryID: string
}

const ResultItem = ({ courseCode, professor, semester, backgroundColor, entryID }: ResultItemProps) => {
  const goToInfoPage = (entryID: string) => {
    router.push(`/entry/${entryID}`);
  }

  return (
    <Container style={{backgroundColor: backgroundColor}} onClick={() => goToInfoPage(entryID)}>
      <CourseCode>{courseCode}</CourseCode>
      <Info style={{marginLeft: "auto"}}>{professor}</Info>
      <Info>{semester}</Info>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid gray;
  position: relative;
  width: 100%;
`;

const CourseCode = styled.div`
  font-weight: 700;
  text-align: center;
`;

const Info = styled.div`
  width: 20%;
  text-align: center;
  @media (max-width: 1000px) {
    width: 30%;
  }
  @media (max-width: 700px) {
    width: 33%;
  }
`;

export default ResultItem;