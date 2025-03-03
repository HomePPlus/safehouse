import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadChecklist } from '../../../api/apiClient';
import './ChecklistComplete.css';

const safetyTips = [  {
  title: "AI 결함 분석",
  content: "AI가 건물의 결함을 분석하여 정확한 진단을 제공합니다.",
  icon: "🤖"
},
  {
    title: "균열 관리 방법",
    content: "미세 균열도 모니터링하고 기록하는 것이 중요합니다.",
    icon: "🔍"
  },
  {
    title: "체계적인 점검",
    content: "체크리스트를 통해 꼼꼼한 건물 점검이 가능합니다.",
    icon: "📋"  },
  {
    title: "데이터 기반 관리",
    content: "점검 체크리스트를 분석하여 보고서를 만들어 드립니다.",
    icon: "📊"
  },
  {
    title: "실시간 모니터링",
    content: "점검 상태를 실시간으로 확인하고 기록할 수 있습니다.",
    icon: "🔄"
  }
];

const ChecklistComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [downloadReady, setDownloadReady] = useState(false);
  const { inspectionId, checklistData, message } = location.state || {};
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % safetyTips.length);
    }, 3000);

    // 데이터 확인 후 다운로드 준비 상태 설정
    if (inspectionId && checklistData) {
      setDownloadReady(true);
    }
    setIsLoading(false);

    return () => clearInterval(tipInterval);
  }, []);

  const handleDownload = async () => {
    if (!inspectionId) {
      alert('다운로드할 보고서 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await downloadChecklist(inspectionId);
      
      // Blob 생성 및 다운로드
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checklist_${inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('보고서 다운로드 실패:', error);
      alert('보고서 다운로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checklist-complete-container">
      <div className="complete-content">
        <h1>체크리스트 작성 완료</h1>
        <p>{message || "체크리스트가 성공적으로 제출되었습니다."}</p>

        {/* 안전 팁 슬라이드쇼 */}
        <div className="safety-tips">
          <div className="tip-icon">{safetyTips[currentTip].icon}</div>
          <h3>{safetyTips[currentTip].title}</h3>
          <p>{safetyTips[currentTip].content}</p>
          <div className="tip-indicators">
            {safetyTips.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentTip ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* 보고서 미리보기 */}
        <div className="report-preview">
          <h2>보고서 미리보기</h2>
          <div className="preview-content">
            <div className="preview-section">
              <h3>기본 정보</h3>
              <p>점검일: {checklistData?.inspectionDate || '정보 없음'}</p>
              <p>점검 ID: {inspectionId || '정보 없음'}</p>
              <p>노후주택 주소: {checklistData?.buildingName || '정보 없음'}</p>
            </div>
          </div>
        </div>

        <div className="complete-actions">
          <button 
            onClick={handleDownload} 
            className="download-btn"
            disabled={!downloadReady}
          >
            보고서 다운로드
          </button>
          <button onClick={() => navigate('/dashboard')} className="return-btn">
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistComplete; 