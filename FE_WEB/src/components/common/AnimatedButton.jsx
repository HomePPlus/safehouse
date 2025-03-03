import React from "react";
import styled from "styled-components";

const AnimatedButton = ({
  text = "Button", // 버튼 텍스트
  variant = "default", // 버튼 스타일 (default, white, transparent)
  href = "#", // 링크 주소
  onClick, // 클릭 이벤트
  className, // 추가 스타일 클래스
}) => {
  return (
    <StyledLink
      href={href}
      className={`${variant} ${className}`}
      onClick={onClick}
    >
      <p>
        <span className="bg" />
        <span className="base" />
        <span className="text">{text}</span>
      </p>
    </StyledLink>
  );
};

const StyledLink = styled.a`
  // 전역 변수 - 버튼의 기본 색상과 크기 설정
  --base: #0f1923; // 배경색/어두운 색상
  --white: #ece8e1; // 밝은 색상
  --pink: #ff4655; // 강조 색상
  --height: 54px; // 버튼 높이
  --transition: 0.3s ease-out all; // 애니메이션 속도와 방식

  width: 100%; // 버튼 너비
  max-width: 240px; // 최대 너비 제한
  height: var(--height); // 버튼 높이
  padding: 8px; // 내부 여백
  font-size: 0.8rem; // 글자 크기
  font-weight: 900; // 글자 굵기
  color: var(--pink); // 글자 색상
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  margin: 10px 0;
  background: transparent;

  // 테두리 설정 - 이 부분을 수정하여 테두리 스타일 변경
  box-shadow: 0 0 0 1px inset var(--white); // 테두리 두께와 색상
  border: none; // 기본 테두리 제거

  &.white:hover > p {
    color: var(--white);
  }

  // 흰색 버전
  &.white > p {
    background: var(--white); // 흰색 배경
    color: var(--base); // 어두운 글자색
    span.base {
      border: 1px solid transparent;
    }
  }
  // 투명 버전
  &.transparent:hover > p {
    // 어두운 배경
    color: var(--white); // 밝은 글자색
    span.text {
      box-shadow: 0 0 0 1px var(--white);
    }
  }

  &.transparent > p {
    background: var(--base);
    color: var(--white);
    span.base {
      border: 1px solid var(--white);
    }
  }

  &:after,
  &:before {
    content: "";
    width: 1px;
    position: absolute;
    height: 8px;
    background: var(--base);
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &:before {
    right: 0;
    left: initial;
  }

  p {
    margin: 0;
    height: var(--height);
    line-height: var(--height);
    box-sizing: border-box;
    z-index: 1;
    left: 0;
    width: 100%;
    position: relative;
    overflow: hidden;

    span.base {
      box-sizing: border-box;
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      left: 0;
      border: 1px solid var(--pink);

      &:before {
        content: "";
        width: 2px;
        height: 2px;
        left: -1px;
        top: -1px;
        background: var(--base);
        position: absolute;
        transition: var(--transition);
      }
    }

    span.bg {
      left: -5%; // 시작 위치
      position: absolute;
      background: var(--pink);
      width: 0;
      height: 100%;
      z-index: 3;
      transition: var(--transition); // 애니메이션 속도
      transform: skewX(-10deg); // 기울기 각도
    }

    span.text {
      z-index: 4;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;

      &:after {
        content: "";
        width: 4px;
        height: 4px;
        right: 0;
        bottom: 0;
        background: var(--base);
        position: absolute;
        transition: var(--transition);
        z-index: 5;
      }
    }
  }

  &:hover {
    color: var(--white); // 호버 시 글자 색상
    span.bg {
      width: 110%; // 호버 시 배경 확장 정도
    }
    span.text:after {
      background: var(--white); // 호버 시 텍스트 배경색
    }
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    cursor: not-allowed;
  }
`;

export default AnimatedButton;
