import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getCourseEmoji, timeAgo } from '../utilities/helpers';
import { EntryResultInfoCompact } from '../utilities/types';
import { useRecoilValue } from 'recoil';
import { userState } from '../utilities/atoms';
import CheckmarkIcon from "../public/checkmark.svg";
import Image from 'next/image';

const SearchResultItem = ({ entry, openInNewTab, showCourseAverage = false }: { entry: EntryResultInfoCompact, openInNewTab: boolean, showCourseAverage?: boolean }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const goToInfoPage = (entryID: string) => {
    if (openInNewTab) {
      window.open(`/entry/${entryID}`);
    } else {
      router.push(`/entry/${entryID}`);
    }
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
        {showCourseAverage &&
          <h6>🎯: {entry.courseAverage}</h6>
        }
      </div>
      <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
        {user?.hasAccessTo.includes(entry.id) && <>
          <Image src={CheckmarkIcon} alt='loading' style={{width: "15px", height: 'auto', marginRight: '6px', marginBottom: '-2px'}}/>
        </>}
        <TimeAgo>{timeAgo(entry?.postTime)}</TimeAgo>
      </div>
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