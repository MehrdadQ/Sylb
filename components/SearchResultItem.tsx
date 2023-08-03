import styled from 'styled-components';
import { getCourseEmoji, timeAgo } from '../utilities/helpers';
import { EntryResultInfoCompact } from '../utilities/types';

const SearchResultItem = ({ entry }: { entry: EntryResultInfoCompact }) => {
  const goToInfoPage = (entryID: string) => {
    window.open(`/entry/${entryID}`);
  }

  return (
    <ResultItem onClick={() => goToInfoPage(entry.id)}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h5>{entry.courseCode} {getCourseEmoji(entry.courseCode.slice(0,3))}</h5>
        <h6>{entry.campus}</h6>
      </div>
      <div>
        <h6>📅: {entry.semester}</h6>
        <h6>👨‍🏫: {entry.professor}</h6>
      </div>
      <TimeAgo>{timeAgo(entry?.postTime)}</TimeAgo>
    </ResultItem>
  )
}

const ResultItem = styled.div`
  background-color: #0A121E;
  color: #ededee;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(0.98);
  }
`;

const TimeAgo = styled.p`
  float: right;
  margin-bottom: 0px;
  font-size: 13px;
  color: #92acc4;
`;

export default SearchResultItem;