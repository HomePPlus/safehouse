import React, { useState, useEffect } from "react";
import "./UserReportTable.css";
import { getReservableReports, createInspectionReports } from "../../../api/apiClient";
import DatePicker from "react-datepicker"; // DatePicker 라이브러리 설치 필요
import "react-datepicker/dist/react-datepicker.css"; // DatePicker 스타일링

const UserReportTable = ({ onUpdateStats, onAlert }) => {
  const [reports, setReports] = useState([]); // 신고 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지
  const [selectedReportId, setSelectedReportId] = useState(null); // 선택한 신고 ID
  const [scheduleDate, setScheduleDate] = useState(new Date()); // 예약 날짜
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker 표시 여부

  const fetchReports = async () => {
    try {
      const response = await getReservableReports();
      const availableReports = response.data.data.map(report => ({
        id: report.report_id,
        report_date: report.report_date,
        report_title: report.report_title,
        report_description: report.report_description,
        report_detail_address: report.report_detail_address,
        defect_type: report.defect_type,
        images: report.images,
        detection_result: report.detection_result || "분석 결과 없음",
        detection_label: report.detection_label,
        total_score: report.total_score
      }));
      setReports(availableReports);
      setError(null);
    } catch (error) {
      console.error("API Error:", error);
      setError("신고 목록을 불러오는데 실패했습니다.");
      onAlert("신고 목록을 불러오는데 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReserve = async () => {
    if (!selectedReportId) {
      onAlert("신고를 선택해주세요.", "error");
      return;
    }

    const requestData = {
      reportId: selectedReportId,
      scheduleDate: scheduleDate.toISOString().split("T")[0],
    };

    try {
      const response = await createInspectionReports(requestData);
      onAlert(response.data.message || "예약이 성공적으로 등록되었습니다.", "success");
      fetchReports();
      setShowDatePicker(false);
      setSelectedReportId(null);
      onUpdateStats();
    } catch (error) {
      console.error("API Error:", error);
      onAlert("예약 등록에 실패했습니다.", "error");
    }
  };

  const handleSchedule = (reportId) => {
    setSelectedReportId(reportId);
    setShowDatePicker(true);
  };
  // 결함 유형 한글 변환 함수
  const translateDefectType = (englishTypes) => {
    if (!englishTypes) return []; // null 또는 undefined일 경우 빈 배열 반환
    // 문자열일 경우 콤마로 구분된 배열로 변환
    const typesArray = Array.isArray(englishTypes) ? englishTypes : englishTypes.split(',');

    // 숫자 제거 정규식 추가
    const typesWithoutNumbers = typesArray.map(type => type.replace(/[0-9_]/g, '').trim());

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

    const translatedTypes = typesWithoutNumbers.map(type => {
      const normalizedType = type.toLowerCase();
      const matchedType = Object.entries(defectTypes).find(([key]) => key.toLowerCase() === normalizedType);

      return matchedType ? matchedType[1] : type;
    });

  // 중복 제거
  const uniqueTypes = [...new Set(translatedTypes)];

  return uniqueTypes;
};
  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      onAlert("오늘 날짜는 예약할 수 없습니다. 다른 날짜를 선택해주세요.", "error");
      return;
    }
    setScheduleDate(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="userReport-error">{error}</div>;
  // 내용 텍스트 줄이기
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="userReport-table-container">
      <table className="userReport-table">
        <thead>
          <tr>
            <th>신고 ID</th>
            <th>신고일</th>
            <th>신고 내용</th>
            <th>주소</th>
            <th>신고된 결함 유형</th>
            <th>AI가 분석한 결함</th>
            <th>위험 점수</th>
            <th>예약하기</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{formatDate(report.report_date)}</td>
                <td title={report.report_description}>{report.report_description}</td>
                <td title={report.report_detail_address}>{report.report_detail_address}</td>
                <td>{report.defect_type}</td>
                <td title={translateDefectType(report.detection_result).join(', ')}>{truncateText(translateDefectType(report.detection_result).join(', '))}</td>
                <td>{report.total_score}</td>
                <td>
                  <button className="userReport-schedule-button" onClick={() => handleSchedule(report.id)}>
                    예약하기
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showDatePicker && (
        <>
          <div className="datepicker-overlay" onClick={() => setShowDatePicker(false)} />
          <div className="userReport-datepicker-container">
            <div className="datepicker-wrapper">
              <DatePicker
                selected={scheduleDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                inline
              />
              <div className="datepicker-buttons">
                <button 
                  className="userReport-datepicker-submit-button" 
                  onClick={handleReserve}
                >
                  예약하기
                </button>
                <button 
                  className="userReport-datepicker-cancel-button" 
                  onClick={() => {
                    setShowDatePicker(false);
                    setSelectedReportId(null);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserReportTable;
