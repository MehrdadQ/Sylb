import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface ScrollDownArrowProps {
  onClick: () => void;
}

const ScrollDownArrow: React.FC<ScrollDownArrowProps> = ({ onClick }) => {
  const [showArrow, setShowArrow] = useState(true);

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    if (scrollPosition > windowHeight * 0.3) {
      setShowArrow(false);
    } else {
      setShowArrow(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ScrollDownArrowContainer $show={showArrow} onClick={showArrow ? onClick : () => null}>
      <Arrow src="down_arrow.svg" alt="Scroll down" />
    </ScrollDownArrowContainer>
  );
};

const moveUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
`;

const ScrollDownArrowContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;

  ${(props) =>
    !props.$show &&
    css`
      opacity: 0;
      cursor: default;
    `}
`;

const Arrow = styled.img`
  width: 50px;
  height: 50px;
  animation: ${moveUpDown} 1s ease-in-out infinite;
`;

export default ScrollDownArrow;
