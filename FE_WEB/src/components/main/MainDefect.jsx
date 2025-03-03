import React, { useState } from 'react';
import { detectDefect } from '../../api/apiClient';
import './MainDefect.css';

// 샘플 이미지 목록
const sampleImages = [
  { 
    id: 1, 
    fileName: 'concreate_crack.jpg', 
    title: '균열 샘플 1',
    url: require('../../assets/images/model/concreate_crack.jpg')
  },
  { 
    id: 2, 
    fileName: 'steeldefect.jpg', 
    title: '강재 손상 샘플 1',
    url: require('../../assets/images/model/steeldefect.jpg')
  },
  { 
    id: 3, 
    fileName: 'spalling.jpg', 
    title: '박리 샘플 1',
    url: require('../../assets/images/model/Spalling.jpg')
  },
  { 
    id: 4, 
    fileName: 'exposure.jpg', 
    title: '철근 노출 샘플 1',
    url: require('../../assets/images/model/exposure.jpg')
  },
  { 
    id: 5, 
    fileName: 'paintdamage.jpg', 
    title: '도장 손상 샘플 1',
    url: require('../../assets/images/model/paintdamage.jpg')
  },
  { 
    id: 6, 
    fileName: 'efforescence.jpg', 
    title: '백태누수 샘플 1',
    url: require('../../assets/images/model/efforescence.jpg')
  },
];

const defectInfo = {
  about: {
    title: "결함 정보",
    description: "AI가 검출한 결함의 상세 정보와 위험도를 확인할 수 있습니다."
  },
  details: {
    title: "상세 설명",
    content: {
      "균열": "콘크리트 구조물의 표면에 발생하는 갈라짐 현상으로, 구조적 안전성에 영향을 미칠 수 있습니다.",
      "강재손상": "강재의 부식, 변형, 균열 등으로 인한 손상으로 구조물의 내구성을 저하시킬 수 있습니다.",
      "박리": "콘크리트 표면이 떨어져 나가는 현상으로, 내부 철근의 노출 위험이 있습니다.",
      "철근노출": "콘크리트 피복의 탈락으로 인해 내부 철근이 외부로 노출된 상태입니다.",
      "도장손상": "도장면의 벗겨짐, 변색 등으로 인한 미관 저하와 부식 위험이 있습니다.",
      "백태": "물의 침투로 인한 백색 물질의 석출과 누수 현상입니다."
    }
  },
  measures: {
    title: "조치 사항",
    content: {
      "균열": "폭과 깊이에 따라 주입식 보수나 충전식 보수가 필요합니다.",
      "강재손상": "부식 제거 후 방청처리 및 보강이 필요합니다.",
      "박리": "손상 부위 제거 후 단면 복구가 필요합니다.",
      "철근노출": "철근 방청처리 후 단면 복구가 필요합니다.",
      "도장손상": "표면 처리 후 재도장이 필요합니다.",
      "백태": "누수 원인 파악 및 방수 처리가 필요합니다."
    }
  }
};

// translateDefectType 함수 추가
const translateDefectType = (englishType) => {
  if (!englishType) return '';
  
  const typeWithoutNumber = englishType.replace(/[0-9_]/g, '').trim();
  const defectTypes = {
    CRACK: '균열',
    crack: '균열',
    LEAK_WHITENING: '백태',
    leak_whitening: '백태',
    Efflorescence_Level: '백태',
    EfflorescenceLevel: '백태',
    STEEL_DAMAGE: '강재손상',
    steel_damage: '강재손상',
    SteelDefectLevel: '강재손상',
    PAINT_DAMAGE: '도장손상',
    paint_damage: '도장손상',
    PaintDamage: '도장손상',
    PEELING: '박리',
    peeling: '박리',
    Spalling: '박리',
    REBAR_EXPOSURE: '철근노출',
    rebar_exposure: '철근노출',
    Exposure: '철근노출',
    UNKNOWN: '모름',
    unknown: '모름',
  };

  const normalizedType = typeWithoutNumber.toLowerCase();
  const matchedType = Object.entries(defectTypes).find(([key]) => 
    key.toLowerCase() === normalizedType
  );

  return matchedType ? matchedType[1] : englishType;
};

const MainDefect = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    try {
      const currentImage = sampleImages[currentImageIndex];
      const response = await detectDefect(currentImage.fileName);
      
      if (response.data && response.data.data) {
        const { totalScore, detections } = response.data.data;
        const label = detections[0]?.label || '결함 없음';
        const translatedLabel = translateDefectType(label);
        setDetectionResult({
          score: totalScore,
          defectLabel: translatedLabel,
        });
      }
    } catch (error) {
      console.error('결함 검출 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sampleImages.length);
    setDetectionResult(null);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? sampleImages.length - 1 : prev - 1
    );
    setDetectionResult(null);
  };

  return (
    <div className="model-demo-section">
      <div className="card-container">
        <div className="image-card">
          <div className="carousel-controls">
            <button onClick={handlePrev} className="carousel-btn prev">&#10094;</button>
            <button onClick={handleNext} className="carousel-btn next">&#10095;</button>
          </div>
          <div className="image-container">
            <img 
              src={sampleImages[currentImageIndex].url}
              alt={sampleImages[currentImageIndex].title}
              className="main-image"
            />
          </div>
          <button 
            onClick={handleDetect} 
            disabled={loading}
            className="detect-button"
          >
            {loading ? '분석 중...' : '결함 탐지해보기'}
          </button>
        </div>

        {detectionResult && (
          <div className="result-card">
            <div className="result-section">
              <h2>결함 탐지 결과</h2>
              <div className="result-content">
                <p>결함 유형: {detectionResult.defectLabel}</p>
                <p>위험 점수: {detectionResult.score.toFixed(1)}</p>
              </div>
            </div>
            
            <div className="result-section">
              <h3>결함 설명</h3>
              <p className="result-content">
                {defectInfo.details.content[detectionResult.defectLabel]}
              </p>
            </div>

            <div className="result-section">
              <h3>조치 사항</h3>
              <p className="result-content">
                {defectInfo.measures.content[detectionResult.defectLabel]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDefect;
