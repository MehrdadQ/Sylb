import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PaginationFirst from '../public/pagination_first.svg'
import PaginationNext from '../public/pagination_next.svg'
import PaginationPrevious from '../public/pagination_previous.svg'
import PaginationLast from '../public/pagination_last.svg'
import PaginationEllipsis from '../public/pagination_ellipsis.svg'
import ScrollToTopIcon from '../public/scroll-to-top.svg'


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  goFirst: () => void;
  goBack: () => void;
  goNext: () => void;
  goLast: () => void;
  onPageClick: (pageNumber: number) => void;
  stepByStep?: boolean;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  goFirst,
  goBack,
  goNext,
  goLast,
  onPageClick,
  stepByStep,
}) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  const getPageNumbersSubset = (stepByStep: boolean | undefined) => {
    if (stepByStep) {
      let upUntil: (string | number)[]
      if (currentPage < 3) {
        upUntil = Array.from({ length: currentPage }, (_, index) => index + 1);
      } else {
        upUntil = ['...', currentPage - 1, currentPage]
      }

      if (currentPage + 1 === totalPages) {
        upUntil.push(totalPages)
      } else if (currentPage < totalPages) {
        upUntil.push(currentPage + 1, '...')
      }
      return upUntil
    }

    const MAX_VISIBLE_PAGES = 3;

    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
    const firstPage = Math.max(currentPage - halfVisible, 1);
    const lastPage = Math.min(firstPage + MAX_VISIBLE_PAGES - 1, totalPages);

    let visiblePages: Array<number | string> = Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);

    if (firstPage > 1) {
      visiblePages = [1, '...', ...visiblePages.slice(1)];
    }
    if (lastPage < totalPages) {
        visiblePages = [...visiblePages.slice(0, visiblePages.length - 1), '...', totalPages];
    }

    return visiblePages;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = getPageNumbersSubset(stepByStep);

  return (
    <PaginationContainer>
      <PageButton onClick={goFirst} disabled={currentPage === 1}>
        <Image src={PaginationFirst} width={20} height={20} alt="First" />
      </PageButton>
      <PageButton onClick={goBack} disabled={currentPage === 1}>
        <Image src={PaginationPrevious} width={20} height={20} alt="Previous" />
      </PageButton>
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <Ellipsis>
              <Image src={PaginationEllipsis} width={20} height={20} alt="..." />
            </Ellipsis>
          ) : (
            <PageButton
              onClick={() => onPageClick(page as number)}
              className={currentPage === page ? 'selected' : ''}
            >
              {page}
            </PageButton>
          )}
        </React.Fragment>
      ))}
      <PageButton onClick={goNext} disabled={currentPage === totalPages}>
        <Image src={PaginationNext} width={20} height={20} alt="Next" />
      </PageButton>
      {!stepByStep && <PageButton onClick={goLast} disabled={currentPage === totalPages}>
        <Image src={PaginationLast} width={20} height={20} alt="Last" />
      </PageButton>}
      {showScrollToTop &&
        <PageButton onClick={scrollToTop}>
          <Arrow src={ScrollToTopIcon} width={20} height={20} alt="Scroll To Top" />
        </PageButton>
      }
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  @media (max-width: 400px) {
    width: 90%;
    justify-content: space-between;
  }
`;

const PageButton = styled.button`
  background-color: black;
  border: none;
  cursor: pointer;
  outline: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin: 0 4px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: black;
  }

  &.selected {
    background-color:  #e3b705;
    color: black;

  }

  &:disabled {
    opacity: 0.5;
    cursor: auto;
  }

  @media (max-width: 400px) {
    margin: 0;
  }
`;

const Ellipsis = styled.span`
  margin: 0 4px;
`;

const moveUpDown = keyframes`
  0%, 100% {
    transform: translateY(3px);
  }

  50% {
    transform: translateY(-3px);
  }
`;

const Arrow = styled(Image)`
  animation: ${moveUpDown} 1s ease-in-out infinite;
`;

export default Pagination;
