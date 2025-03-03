// VideoButton.jsx
import React, { useState } from "react";
import styled from "styled-components";
import backgroundVideo from "../../assets/video/draw_ai.mp4"; // 비디오 파일 경로

// styled-components 정의
const Wrapper = styled.div`
  --color: #1f242d;
  --color-invert: #ffffff;
  // 동그라미 크기 조절 - 기본, 호버, 클릭 시 크기
  --clip-path: circle(35px at left); // 기본 크기 증가
  --clip-path-hover: circle(100px at left); // 호버 시 크기 증가
  --clip-path-clicked: circle(100vw at left);
  --duration: 0.4s;
  --timing-function: ease;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  &:hover {
    .video-container {
      clip-path: var(--clip-path-hover);
    }
  }
`;

const VideoContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
  clip-path: ${(props) =>
    props.isChecked ? "var(--clip-path-clicked)" : "var(--clip-path)"};
  transition: clip-path var(--duration) var(--timing-function);

  // 호버 효과 추가
  &:hover {
    clip-path: var(--clip-path-hover);
  }
`;

const Video = styled.video`
  position: fixed;
  background: #c4cbde;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
`;

const Text = styled.div`
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.2px;
  // 체크박스 상태에 따라 텍스트 숨김 처리
  opacity: ${(props) => (props.isChecked ? 0 : 1)};
  transition: opacity 0.3s var(--timing-function);
  color: #ffffff; // 원하는 색상으로 변경
`;

const TextSpan = styled.span`
  &::before,
  &::after {
    content: attr(data-text);
    padding-left: 26px;
  }

  &::before {
    color: #ffffff; // 첫 번째 텍스트 색상
  }

  &::after {
    color: #ffb800; // 두 번째 텍스트 색상 (호버/활성화 시)
    clip-path: var(--clip-path);
    transition: clip-path var(--duration) var(--timing-function);
    position: absolute;
    left: 0;
  }
`;

const Input = styled.input`
  width: 220px;
  height: 40px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 40px;
  outline: none;
  z-index: 2;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  &:checked {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const VideoButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Wrapper>
      <Input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <VideoContainer isChecked={isChecked}>
        <Video src={backgroundVideo} loop muted autoPlay playsInline />
      </VideoContainer>
      {/* Text 컴포넌트에 isChecked prop 전달 */}
      <Text isChecked={isChecked}>
        <TextSpan data-text="Watch the video" />
      </Text>
    </Wrapper>
  );
};

export default VideoButton;
