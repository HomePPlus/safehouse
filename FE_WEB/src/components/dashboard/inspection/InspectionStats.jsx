import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiClient";
import "./InspectionStats.css";

const InspectionStats = ({ stats }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stats) {
      console.log("받은 통계 데이터:", stats); // 데이터 확인용 로그
      setLoading(false);
    }
  }, [stats]);

  if (loading) return <div>통계 데이터를 불러오는 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div>통계 정보가 없습니다.</div>;

  // 각 상태값이 undefined일 경우 0으로 표시
  const scheduled = stats["예정됨"] ?? 0;
  const inProgress = stats["진행중"] ?? 0;
  const completed = stats["완료됨"] ?? 0;
  const cancelled = stats["취소됨"] ?? 0;

  return (
    <div className="status-container">
      <h2>점검 현황</h2>
      <div className="status-grid">
        <div className="status-card scheduled">
          <h3>예정됨</h3>
          <span className="status-number">{scheduled}</span>
        </div>
        <div className="status-card in-progress">
          <h3>진행중</h3>
          <span className="status-number">{inProgress}</span>
        </div>
        <div className="status-card completed">
          <h3>완료됨</h3>
          <span className="status-number">{completed}</span>
        </div>
        <div className="status-card cancelled">
          <h3>취소됨</h3>
          <span className="status-number">{cancelled}</span>
        </div>
      </div>
    </div>
  );
};

export default InspectionStats;
