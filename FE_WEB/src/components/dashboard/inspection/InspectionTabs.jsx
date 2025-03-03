import React, { useState } from "react";
import InspectionTable from "./InspectionTable";
import UserReportTable from "../userReportTable/UserReportTable";
import "./InspectionTabs.css";

const InspectionTabs = ({ onAlert, onUpdateStats }) => {
  const [activeTab, setActiveTab] = useState("reports");
  const [statusFilter, setStatusFilter] = useState('전체');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="inspection-tabs-container">
      <div className="tabs-header">
        <div className="inspection-tabs">
          <input
            type="radio"
            id="reports-tab"
            name="inspection-tabs"
            value="reports"
            checked={activeTab === "reports"}
            onChange={() => handleTabChange("reports")}
            className="tab-input"
          />
          <label htmlFor="reports-tab" className={`tab-label ${activeTab === "reports" ? "active" : ""}`}>
            신고 목록
          </label>

          <input
            type="radio"
            id="inspections-tab"
            name="inspection-tabs"
            value="inspections"
            checked={activeTab === "inspections"}
            onChange={() => handleTabChange("inspections")}
            className="tab-input"
          />
          <label htmlFor="inspections-tab" className={`tab-label ${activeTab === "inspections" ? "active" : ""}`}>
            점검 목록
          </label>
        </div>
        
        {/* 점검 목록 탭이 활성화될 때만 필터 표시 */}
        {activeTab === "inspections" && (
          <select 
            className={`status-filter ${statusFilter}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="전체">전체 보기</option>
            <option value="예정됨">예정됨</option>
            <option value="진행중">진행중</option>
            <option value="완료됨">완료됨</option>
            <option value="취소됨">취소됨</option>
          </select>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "reports" && (
          <UserReportTable 
            onAlert={onAlert} 
            onUpdateStats={onUpdateStats}
          />
        )}
        {activeTab === "inspections" && (
          <InspectionTable 
            onAlert={onAlert} 
            onUpdateStats={onUpdateStats}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
      </div>
    </div>
  );
};

export default InspectionTabs;
