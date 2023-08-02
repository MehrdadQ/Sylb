import router from 'next/router';
import styled from 'styled-components';
import { EntryResultInfoCompact, SearchResultItemProps } from '../utilities/types';
import { getCourseEmoji, timeAgo } from '../utilities/helpers';

const SearchResultItem = ({ entry }: { entry: EntryResultInfoCompact }) => {
  const goToInfoPage = (entryID: string) => {
    window.open(`/entry/${entryID}`);
  }

  return (
    <ResultItem onClick={() => goToInfoPage(entry.id)}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h5>{getCourseEmoji(entry.courseCode.slice(0,3))} {entry.courseCode}</h5>
        <h6>{entry.campus}</h6>
      </div>
      <h6>{entry.semester}</h6>
      <h6>{entry.professor}</h6>
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
`;

const TimeAgo = styled.p`
  float: right;
  margin-bottom: 0px;
  font-size: 13px;
`;

export default SearchResultItem;