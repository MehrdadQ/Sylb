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
    <Container
      style={{
        backgroundColor: entryID === "HEADER" ? "#0A121E" : backgroundColor,
        fontWeight: entryID === "HEADER" ? 700 : 200,
        cursor: entryID === "HEADER" ? 'auto' : 'pointer'
      }}
      onClick={entryID === "HEADER" ? () => null : () => goToInfoPage(entryID)}
    >
      <CourseCode>{courseCode}</CourseCode>
      <Info>{professor}</Info>
      <Info>{semester}</Info>
    </Container>
  )
}

const Container = styled.div`
  color: #ededee;
  display: flex;
  text-align: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid gray;
  position: relative;
  width: 100%;
  cursor: pointer;
  background-color: #0f2649;
  border: none;
  @media (max-width: 700px) {
    font-size: 14px;
  }
`;

const CourseCode = styled.div`
  width: 40%;
  @media (max-width: 700px) {
    width: 33%;
    padding: 0;
  }
`;

const Info = styled.div`
  width: 20%;
  padding: 0 1rem;
  @media (max-width: 700px) {
    width: 33%;
    padding: 0
  }
`;

export default ResultItem;