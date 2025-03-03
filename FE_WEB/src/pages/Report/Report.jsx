import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input/Input'; // Input 컴포넌트 임포트
import './Report.css'; // CSS 파일을 별도로 만들어 스타일 적용
import Button from '../../components/common/Button/Button'; // Button 컴포넌트 임포트
import DropDown from '../../components/common/DropDown/DropDown'; // DropDown 컴포넌트 임포트
import FormGroup from '../../components/FormGroup/FormGroup';
import FileUpload from '../../components/FileUpload/FileUpload';
import { getUserInfo } from '../../utils/auth';
import { createReport } from '../../api/apiClient'; // 신고 생성 API 호출 함수 임포트
import defectTypes from '../../components/defect/defectTypes';
import { useAlert } from '../../contexts/AlertContext';

const Report = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [address, setAddress] = useState(''); // 기본 주소
  const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
  const [title, setTitle] = useState(''); // 신고 제목
  const [report, setReport] = useState(''); // 신고 내용
  const [selectedOption, setSelectedOption] = useState(''); // 결함 유형 선택
  const [selectedFile, setSelectedFile] = useState(null); // 첨부 파일
  const [detectionResult, setDetectionResult] = useState(''); // 모델 결과 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 결과 모달
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedDefect, setSelectedDefect] = useState(null); // 선택된 결함 유형 정보 상태 추가
  const [hoveredDefect, setHoveredDefect] = useState(null); // 호버된 결함 정보 상태 추가

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/report/list');
  };

  useEffect(() => {
    // Daum 우편번호 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.roadAddress || data.jibunAddress;
        setAddress(addr);
        document.querySelector('.detailAddress-input').focus(); // 상세주소 입력 필드로 포커스 이동
      },
    }).open();
  };

  // 결함 유형별 색상 매핑
  const defectColors = {
    CRACK: '#FF6B6B',
    PEELING: '#4ECDC4',
    LEAK: '#45B7D1',
    REBAR_EXPOSURE: '#96CEB4',
    STEEL_DAMAGE: '#D4A373',
    PAINT_DAMAGE: '#9B5DE5',
    UNKNOWN: '#666666'
  };

  // 드롭다운 옵션 수정
  const defectOptions = Object.entries(defectTypes).map(([key, type]) => ({
    value: type.label,
    className: key, // 결함 유형별 클래스 추가
    onMouseEnter: () => setHoveredDefect(type),
    onMouseLeave: () => setHoveredDefect(null)
  }));

  // 드롭다운 선택 핸들러 수정
  const handleDropdownSelect = (value) => {
    setSelectedOption(value);
    // defectTypes에서 선택된 결함 유형 찾기
    const selectedType = Object.entries(defectTypes).find(
      ([_, type]) => type.label === value
    );
    if (selectedType) {
      setSelectedDefect(selectedType[1]); // 선택된 결함 정보 저장
    }
    console.log('선택된 값:', value);
  };

  // 신고 제출 핸들러
  const handleSubmit = async () => {
    if (!address || !detailAddress || !report || !selectedOption) {
      showAlert('모든 항목을 입력해주세요.', 'error');
      return;
    }

    // 신고 내용 길이 체크 추가
    if (report.length > 1000) {  // 예시로 1000자로 제한
      showAlert('신고 내용은 1000자를 초과할 수 없습니다.', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    const formData = new FormData();
    formData.append(
      'report',
      JSON.stringify({
        reportTitle: title.slice(0, 100),  // 제목 길이 제한
        reportDetailAddress: `${address} ${detailAddress}`.slice(0, 255),  // 주소 길이 제한
        reportDescription: report.slice(0, 1000),  // 내용 길이 제한
        defectType: selectedOption,
      })
    );
    if (selectedFile) {
      formData.append('images', selectedFile);
    }

    try {
      // 프로그레스 바 애니메이션
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      const response = await createReport(formData);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      if (response.data && response.data.data) {
        const detectionResult = response.data.data.detection_result;
        console.log("AI 분석 결과:", detectionResult);  // 로그 추가

        if (detectionResult && detectionResult.trim() !== '') {
          // translateDefectType 함수 수정
          const translateDefectType = (englishType) => {
            if (!englishType) return '';
            
            const typeWithoutNumber = englishType.replace(/[0-9_]/g, '').trim();
            const defectTypes = {
              CRACK: '균열',
              crack: '균열',
              LEAK_WHITENING: '백태/누수',
              leak_whitening: '백태/누수',
              Efflorescence_Level: '백태/누수',
              EfflorescenceLevel: '백태/누수',
              STEEL_DAMAGE: '강재 손상',
              steel_damage: '강재 손상',
              SteelDefectLevel: '강재 손상',
              PAINT_DAMAGE: '도장 손상',
              paint_damage: '도장 손상',
              PaintDamage: '도장 손상',
              PEELING: '박리',
              peeling: '박리',
              Spalling: '박리',
              REBAR_EXPOSURE: '철근 노출',
              rebar_exposure: '철근 노출',
              Exposure: '철근 노출',
              UNKNOWN: '모름',
              unknown: '모름',
            };

            const normalizedType = typeWithoutNumber.toLowerCase();
            const matchedType = Object.entries(defectTypes).find(([key]) => 
              key.toLowerCase() === normalizedType
            );

            return matchedType ? matchedType[1] : englishType;
          };

          // 콤마로 구분된 결함 유형들을 각각 번역
          const translatedTypes = [...new Set(
            detectionResult.split(',')
              .map(type => translateDefectType(type.trim()))
              .filter(type => type) // 빈 문자열 제거
          )].join(', ');

          setDetectionResult(
            `이미지 분석이 완료되었습니다!

            ${translatedTypes} 유형의 결함이 발견되었습니다.
            
            빠른 시일 내에 전문가가 방문하여 자세히 살펴보도록 하겠습니다!`
          );
        } else {
          setDetectionResult(
            `분석 결과 즉각적인 조치가 필요한 위험한 결함은 발견되지 않았습니다.

            전문 점검자가 이미지를 상세히 검토한 후,
            필요한 경우 점검 안내를 드리도록 하겠습니다!

            안전한 주거 환경을 위해 지속적으로 관리하겠습니다.`
          );
        }
        setIsModalOpen(true);
        showAlert('신고가 성공적으로 접수되었습니다.');
      } else {
        throw new Error('API 응답 데이터가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('신고 제출 중 오류:', error);
      showAlert(error.response?.data?.message || '신고 접수 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 버튼 핸들러 추가
  const handleCancel = () => {
    navigate('/report/list');  // 신고 리스트 페이지로 이동
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // children이 문자열인지 확인하고 처리
    const messageLines = typeof children === 'string' 
      ? children.split('\n').filter(line => line.trim() !== '')
      : [];

    return (
      <div className="report-modal-overlay">
        <div className="report-modal-content">
          <h3>이미지 분석 결과</h3>
          <div className="detection-message">
            {messageLines.map((line, index) => (
              <p key={index} className="result-line">{line.trim()}</p>
            ))}
          </div>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    );
  };

  // 로딩 컴포넌트 추가
  const LoadingScreen = () => {
    const [tip, setTip] = useState("🔍 이미지를 자세히 살펴보는 중입니다..."); // 초기값 설정
    
    const tips = [
      "🏗️ AI가 건물의 결함을 분석하고 있습니다...",
      "🔍 이미지를 자세히 살펴보는 중입니다...",
      "📊 결함의 심각도를 평가하고 있습니다...",
      "🤖 꼼꼼히 보느라 시간이 걸리네요...! 조금만 기다려주세요!"
    ];

    useEffect(() => {
      let currentIndex = 0;
      const tipInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % tips.length;
        setTip(tips[currentIndex]);
      }, 2000);

      return () => clearInterval(tipInterval);
    }, []);

    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-animation">
            <div className="building-row">
              <span className="building">🏢</span>
              <span className="building delay-1">🏚️</span>
              <span className="building delay-2">🏤</span>
              <span className="building delay-3">🏘️</span>
              <span className="building delay-4">🏬</span>
            </div>
          </div>
          <div className="loading-tip">{tip}</div>
          <div className="report-progress-bar">
            <div 
              className="report-progress-fill"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="report-progress-text">
            {loadingProgress}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="report-wrapper">
      {isLoading && <LoadingScreen />}
      <div className="report-container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '100px',
          }}
        >
          <h1>신고할 내용을 양식에 맞게 작성해주세요.</h1>
          <FormGroup>
            {/* 작성자 */}
            <div className="form-row">
              <label className="form-label">작성자</label>
              <Input className="name-input" value={getUserInfo()?.email || ''} disabled />
            </div>

            {/* 주소 입력 */}
            <div className="form-row">
              <div className="address-group">
                <label className="form-label">주소</label>
                <Input className="address-input" placeholder="주소를 검색해주세요" value={address} disabled />
                <Button className="address-search" onClick={handleAddressSearch}>
                  주소 검색
                </Button>
                <Input
                  className="detailAddress-input"
                  placeholder="상세주소를 입력해주세요"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </div>
            </div>

            {/* 제목 입력 */}
            <div className="form-row">
              <label className="form-label">제목</label>
              <Input
                className="title-input"
                placeholder="신고 제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 신고 내용 */}
            <div className="form-row-text">
              <label className="form-content-label">내용</label>
              <textarea
                className="report-input"
                placeholder="신고 내용을 자세히 입력해주세요"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                maxLength={1000}
              />
              {/* 결함 유형 선택 */}
            <div className="defect-selection-wrapper">
              <div className="defect-dropdown">
                <DropDown
                  options={defectOptions}
                  placeholder="결함 유형 선택"
                  onSelect={(value) => {
                    handleDropdownSelect(value);
                    setHoveredDefect(null);  // 선택 시 hoveredDefect를 null로 설정
                  }}
                />
                {hoveredDefect && (  // selectedOption 조건 제거
                  <div className={`defect-info-popup ${hoveredDefect ? 'visible' : ''}`}>
                    <h4 style={{ 
                      color: defectColors[Object.keys(defectTypes).find(key => defectTypes[key] === hoveredDefect)] 
                    }}>
                      {hoveredDefect.label}
                    </h4>
                    <p>{hoveredDefect.description}</p>
                    {hoveredDefect.exampleImage && (
                      <img 
                        className="defect-example-image"
                        src={hoveredDefect.exampleImage} 
                        alt={`${hoveredDefect.label} 예시`} 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* 파일 선택 */}
            <div className="form-row sel_image">
              <FileUpload className="report-upload" onFileSelect={(file) => setSelectedFile(file)} />
            </div>
          </FormGroup>

          {/* 버튼 */}
          <Button className="report-button" onClick={handleSubmit}>
            확인
          </Button>
          <Button className="report-cancel" onClick={handleCancel}>취소</Button>

          {/* 결과 표시 */}
          {detectionResult && (
            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
              {detectionResult}
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;