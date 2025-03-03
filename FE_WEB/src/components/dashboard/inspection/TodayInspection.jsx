import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiClient";
import "./TodayInspection.css";

const TodayInspection = () => {
  const [inspections, setInspections] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayInspections = async () => {
    try {
      const today = new Date();
      today.setDate(today.getDate()); // 현재 날짜에 하루를 더함
      const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
      console.log(`API 요청 날짜: ${formattedDate}`); // 로깅 추가
      const response = await apiClient.get(`/api/inspections/today?date=${formattedDate}`);
      setInspections(response.data.data);
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError("오늘의 점검 일정을 불러오는데 실패했습니다.");
      console.error("Error fetching today's inspections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayInspections();
  }, []);

  const getStatusClassName = (status) => {
    switch (status) {
      case "예정됨":
        return "status-scheduled";
      case "진행중":
        return "status-in-progress";
      case "완료됨":
        return "status-completed";
      default:
        return "";
    }
  };

  if (loading) return "로딩중...";
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="today-inspection-container">
      <h2 className="section-title today-inspection-title">오늘의 점검 🔍 </h2>
      {inspections.length === 0 ? (
        <div className="no-inspection-message">{message}</div>
      ) : (
        <div className="inspection-cards">
          {inspections.map((inspection) => {
            const reportInfo = inspection.report_info || {};
            return (
              <div key={inspection.inspection_id} className="inspection-card">
                <div className="inspection-header">
                  <span className="inspection-type">{inspection.type}</span>
                  <span className={`inspection-status ${getStatusClassName(inspection.status)}`}>
                    {inspection.status}
                  </span>
                </div>
                <div className="inspection-body">
                  <div className="inspection-detail">
                    <strong>점검자:</strong> {inspection.inspector_name}
                  </div>
                  <div className="inspection-detail">
                    <strong>예정일:</strong> {inspection.schedule_date}
                  </div>
                  <div className="inspection-detail">
                    <strong>주소:</strong> {reportInfo.detail_address || "-"}
                  </div>
                  <div className="inspection-detail">
                    <strong>결함 유형:</strong> {reportInfo.defect_type || "-"}
                  </div>
                  <div className="inspection-description">
                    <strong>신고 내용:</strong> {reportInfo.description || "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayInspection;
