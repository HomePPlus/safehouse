import React, { useEffect, useState, useRef } from 'react';
import { Card, Carousel } from '../components/common/Carousel/Carousel';
import { detectDefect } from '../api/apiClient';
import MainAnimation from '../components/main/MainAnimation';
import MainDefect from '../components/main/MainDefect';
import AppDownloadSection from '../components/main/AppDownloadSection';
import './MainPage.css';

const MainPage = () => {
  const [text, setText] = useState('');
  const [showCarouselText, setShowCarouselText] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [showPostAnimationText, setShowPostAnimationText] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const carouselTextRef = useRef(null);
  const [showAppCard, setShowAppCard] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 430;
      const startScroll = 100;

      if (scrollY > startScroll) {
        const element = carouselTextRef.current;
        if (element) {
          const translateY = Math.min(scrollY - startScroll, maxScroll);
          element.style.transform = `translateY(${translateY}px)`;
        }
      } else {
        const element = carouselTextRef.current;
        if (element) {
          element.style.transform = 'translateY(0)';
        }
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + windowHeight;
      const scrollPercentage = (window.scrollY / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage > 70) {
        setShowAppCard(true);
      } else {
        setShowAppCard(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnimationComplete = () => {
    if (!animationDone) {
      setMoveUp(true);
      setTimeout(() => {
        setShowPostAnimationText(true);
        setTimeout(() => {
          setShowCarouselText(true);
          setAnimationDone(true);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="main-container">
      <div className={`animation-section ${moveUp ? 'move-up' : ''}`}>
        {!animationDone && <MainAnimation onComplete={handleAnimationComplete} />}
      </div>
      {showPostAnimationText && (
        <div className={`post-animation-text ${showPostAnimationText ? 'show' : ''}`}>
          <span className="gray-text">당신의 </span>
          <span className="blue-text">안</span>
          <span className="gray-text">전한 </span>
          <span className="blue-text">주</span>
          <span className="gray-text">택, </span>
          <span className="blue-text">안주</span>
        </div>
      )}
      <div className={`carousel-section ${moveUp ? 'show' : ''}`}>
        <div 
          ref={carouselTextRef}
          className={`carousel-intro-text ${showCarouselText ? 'show' : ''}`}
        >
          안전한 주거 공간의 시작, <span className="defect-diagnosis">AI 결함 진단</span>을 체험해보세요!
        </div>
        <div className={`carousel-container ${showCarouselText ? 'show' : ''}`}>
          <MainDefect />
        </div>
      </div>
      <div className="fixed-scroll-image">
        <img src={require('../assets/images/scroll.png')} alt="Scroll" />
      </div>
      <div className={`app-download-section ${showAppCard ? 'show' : ''}`}>
        <AppDownloadSection />
      </div>
    </div>
  );
};

export default MainPage;
