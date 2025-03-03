import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import './MainAnimation.css';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(TextPlugin);

const MainAnimation = ({ onComplete }) => {
  const wrapRef = useRef(null);
  const text1Ref = useRef(null);
  const timeline = useRef();
  const { contextSafe } = useGSAP({ scope: wrapRef });
  const containerRef = useRef(null);

  const messages = [
    "안전한 주거환경을 만들어드립니다",
    "안주",
    "AI 결함 탐지 시스템",
    "실시간 건물 진단 서비스",
    "스마트한 관리 솔루션",
    "지금 바로 경험해보세요",
    "Safety Starts Here"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight;

      if (scrollPosition > threshold) {
        containerRef.current.style.opacity = '0'; // 스크롤 시 애니메이션 숨기기
      } else {
        containerRef.current.style.opacity = '1'; // 다시 보이게
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useGSAP(() => {
    timeline.current = gsap.timeline({
      onComplete: contextSafe(() => {
        onComplete();
      })
    });

    timeline.current
      .from(wrapRef.current, {
        duration: 0.7,
        scale: 0.8,
        opacity: 0,
        ease: "power3.out"
      })
      .to(text1Ref.current, {
        duration: 0.7,
        text: messages[0],
        opacity: 1,
        y: 0,
        ease: "power4.out"
      });

    messages.slice(1).forEach((msg, i) => {
      timeline.current
        .to(text1Ref.current, {
          duration: 0.7,
          text: msg,
          ease: "power2.inOut"
        })
        .to(wrapRef.current, {
          duration: 0.6,
          scale: 1.1,
          yoyo: true,
          repeat: 1
        });
    });

    timeline.current
      .to(text1Ref.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power4.inOut"
      })
      .to(wrapRef.current, {
        opacity: 0,
        duration: 0.3
      });

    return () => timeline.current.kill();
  },
  { dependencies: [onComplete, messages] });

  return (
    <div ref={containerRef} className="MainAnimation-container">
      <div className="MainAnimation-textWrap" ref={wrapRef}>
        <span className="MainAnimation-textMain" ref={text1Ref}></span>
      </div>
    </div>
  );
};

export default MainAnimation;
