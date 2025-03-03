import React from 'react';
import AppCardComponent from './AppCardComponent';
import { QRCodeSVG } from 'qrcode.react'; // QRCodeSVG로 변경
import './AppDownloadSection.css';

const AppDownloadSection = () => {
  // 예: 192.168.0.xxx:3000/app-preview
  const previewUrl = 'https://safehouse-react-a5eyc2a9a0byd5hq.koreacentral-01.azurewebsites.net//app-preview';  

  return (
    <div className="app-download-container">
      <div className="app-card-wrapper">
        <AppCardComponent 
          // title="안주" 
          // subtitle="AI 결함 진단 앱" 
          imageUrl={require('../../assets/images/app.png')}
        />
      </div>
      <div className="app-info-wrapper">
        <h2 className="app-title">안주 모바일 앱 다운로드</h2>
        <p className="app-description">
          언제 어디서나 편리하게<br/>
          AI 결함 진단을 시작하세요
        </p>
        <div className="app-features">
          <div className="feature">
            <span className="feature-icon">📢</span>
            <span>
              <span className="highlight">실시간 결함 진단</span>으로 빠르게 신고하기
            </span>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <span>
              <span className="highlight">지도, </span> 
              <span className="highlight">통계, </span> 
              <span className="highlight">일정 관리</span>까지 한 곳에서 해결하는<br/>
              <span className="highlight">올인원 대시보드</span>
            </span>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <span>
              체크리스트 기반 <span className="highlight">AI 보고서</span> 생성
            </span>
          </div>
        </div>
        <div className="download-options">
          <div className="qr-code">
            <img 
              src={require('../../assets/images/app/qrcode.jpeg')} 
              alt="QR 코드" 
              className="qr-code"
            />
            <span>QR코드로 앱 다운로드</span>
          </div>
          {/* <div className="store-buttons">
            <button className="store-button google-play">
              Google Play
            </button>
            <button className="store-button app-store">
              App Store
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AppDownloadSection;
