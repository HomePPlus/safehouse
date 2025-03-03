// NavigationBar.jsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';

// 네비게이션 바 컴포넌트: items(아이콘과 라벨 배열)와 클릭 이벤트 핸들러를 props로 받음
const NavigationBar = ({ 
  items = [], // 네비게이션 아이템 배열 (기본값: 빈 배열)
  onItemClick // 아이템 클릭 시 실행될 콜백 함수
}) => {
  // 현재 활성화된 아이템의 인덱스 상태 관리
  const [activeIndex, setActiveIndex] = useState(0);

  // 아이템 클릭 핸들러: 활성화 상태 변경 및 상위 컴포넌트에 이벤트 전달
  const handleItemClick = (index) => {
    setActiveIndex(index);
    if (onItemClick) onItemClick(index);
  };

  return (
    <NavContainer>
      <Background />
      <NavList>
        {items.map((item, index) => (
          <NavItem 
            key={index}
            active={activeIndex === index}
            onClick={() => handleItemClick(index)}
          >
            {item.icon} {/* 아이콘 컴포넌트 렌더링 */}
            <Label active={activeIndex === index}>{item.label}</Label>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

// 네비게이션 바의 최상위 컨테이너 스타일
const NavContainer = styled.nav`
  padding: 0.3em;          // 내부 여백
  position: relative;      // 자식 요소의 기준점
  display: flex;           // 플렉스 컨테이너로 설정
  justify-content: center; // 가운데 정렬
  border-radius: 25px;     // 모서리 둥글게 (수정 가능)
  overflow: hidden;        // 내부 요소가 컨테이너를 벗어나지 않도록
`;

// 흰색 배경 스타일 컴포넌트
const Background = styled.div`
  position: absolute;      // 컨테이너 기준 절대 위치
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white; // 배경색 (수정 가능)
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // 그림자 효과 (수정 가능)
`;

// 네비게이션 아이템 리스트 스타일
const NavList = styled.ul`
  width: auto;             // 자동 너비
  margin: 0;
  padding: 0.5em 1em;      // 내부 여백 (수정 가능)
  list-style: none;        // 리스트 스타일 제거
  display: flex;           // 플렉스 컨테이너
  gap: 1.5rem;            // 아이템 간격 (수정 가능)
  align-items: center;     // 세로 중앙 정렬
  position: relative;      // 상대 위치
  z-index: 1;             // 배경보다 위에 표시
`;

// 각 네비게이션 아이템 스타일
const NavItem = styled.li`
  cursor: pointer;         // 마우스 포인터 변경
  display: flex;
  align-items: center;     // 세로 중앙 정렬
  padding: 0.5em 1em;      // 내부 여백 (수정 가능)
  border-radius: 20px;     // 모서리 둥글게 (수정 가능)
  position: relative;
  transition: all 0.3s ease; // 애니메이션 효과 (수정 가능)

  // 아이콘 이미지 스타일
  img {
    width: 24px;           // 아이콘 크기 (수정 가능)
    height: 24px;
    opacity: ${props => props.active ? 1 : 0.6}; // 활성화 상태에 따른 투명도
    transition: all 0.3s ease;
  }

  // 호버 효과
  &:hover img {
    opacity: 1;
  }

  // 활성화 상태일 때 배경색 변경
  ${props => props.active && `
    background: #FFB800;   // 활성화 배경색 (수정 가능)
  `}
`;

// 라벨(텍스트) 스타일
const Label = styled.span`
  color: white;            // 텍스트 색상 (수정 가능)
  margin-left: 0.5rem;     // 왼쪽 여백 (수정 가능)
  font-size: 0.8em;        // 글자 크기 (수정 가능)
  opacity: ${props => props.active ? 1 : 0}; // 활성화 상태에 따른 투명도
  visibility: ${props => props.active ? 'visible' : 'hidden'}; // 표시/숨김
  transition: all 0.3s ease; // 애니메이션 효과
  white-space: nowrap;     // 텍스트 줄바꿈 방지
`;

export default NavigationBar;
