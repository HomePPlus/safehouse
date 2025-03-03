import React, { useState, useEffect } from 'react';
import { detectDefect } from '../../../api/apiClient';
import './RegularInspection.css';

const RegularInspection = ({ onAlert }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResults, setDetectionResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 결함 유형 한글 변환
  const translateDefectType = (englishType) => {
    const defectTypes = {
      'CRACK': '균열',
      'crack': '균열',
      'LEAK_WHITENING': '백태/누수',
      'leak_whitening': '백태/누수',
      'Efflorescence_Level': '백태/누수',
      'STEEL_DAMAGE': '강재 손상',
      'steel_damage': '강재 손상',
      'PAINT_DAMAGE': '도장 손상',
      'paint_damage': '도장 손상',
      'PEELING': '박리',
      'peeling': '박리',
      'Spalling': '박리',
      'REBAR_EXPOSURE': '철근 노출',
      'rebar_exposure': '철근 노출',
      'Exposure': '철근 노출'
    };

    // 숫자와 언더스코어 제거
    const cleanType = englishType.replace(/[0-9_]/g, '').trim();
    return defectTypes[cleanType] || englishType;
  };

  const handleImageSelect = async (imagePath) => {
    setSelectedImage(imagePath);
    setIsLoading(true);

    try {
      const response = await detectDefect(imagePath);
      if (response.data && response.data.detections) {
        // 결함 유형을 한글로 변환하고 중복 제거
        const translatedTypes = response.data.detections
          .map(detection => translateDefectType(detection.label));
        const uniqueTypes = [...new Set(translatedTypes)];
        
        setDetectionResults({
          defectTypes: uniqueTypes,
          totalScore: response.data.totalScore,
          image: response.data.image // 처리된 이미지
        });
        onAlert('결함 검출이 완료되었습니다.');
      }
    } catch (error) {
      console.error('결함 검출 실패:', error);
      onAlert('결함 검출에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="regular-inspection-container">
      <div className="image-grid">
        {selectedImage && (
          <div className="selected-image-container">
            <img 
              src={`${process.env.REACT_APP_API_URL}/images/${selectedImage}`} 
              alt="선택된 이미지" 
              className="selected-image"
            />
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>결함을 검출하고 있습니다...</p>
        </div>
      )}

      {detectionResults && (
        <div className="detection-result-container">
          <h3>검출 결과</h3>
          <div className="result-content">
            <p>검출된 결함: {detectionResults.defectTypes?.join(', ')}</p>
            <p>심각도 점수: {detectionResults.totalScore?.toFixed(2)}</p>
          </div>
          {detectionResults.image && (
            <div className="processed-image-container">
              <img 
                src={`data:image/jpeg;base64,${detectionResults.image}`} 
                alt="처리된 이미지" 
                className="processed-image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegularInspection; 