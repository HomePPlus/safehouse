import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import ReportDashboard from "../../components/dashboard/ReportDashboard";
import TodayInspection from "../../components/dashboard/inspection/TodayInspection";
import DefectStats from "../../components/dashboard/inspection/DefectStats";
import MiniCalendar from "../../components/common/Calendar/MiniCalendar";
import Sidebar from "../../components/Sidebar/Sidebar";
import NaverMap from "../../components/dashboard/map/NaverMap";
import ChecklistPage from "./ChecklistPage";
import { getTodayInspections } from "../../api/apiClient";
import InspectionTabs from "../../components/dashboard/inspection/InspectionTabs";
import DetectionStats from "../../components/dashboard/detection/DetectionStats";
import UserReportTable from "../../components/dashboard/userReportTable/UserReportTable";
import { useAlert } from "../../contexts/AlertContext";
import ChecklistCompleteList from '../../components/dashboard/checklist/ChecklistCompleteList';

const Dashboard = () => {

  const [activeView, setActiveView] = useState("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [reports, setReports] = useState([]); // 신고 데이터를 저장
  const reportDashboardRef = useRef(); // useRef를 컴포넌트 최상위 레벨에서 선언
  const [currentPage, setCurrentPage] = useState(0);
  const [alerts, setAlerts] = useState([]); // 알람 메시지 저장
  const ITEMS_PER_PAGE = 2;
  const { showAlert } = useAlert();  // useAlert 훅 사용

  // 점검 데이터와 신고 데이터를 구분
  const userReports = reports.filter((report) => report.type === "신고");
  const inspectionReports = inspections.filter((inspection) => inspection.type === "점검");
  
  const handleAlert = (message) => {
    console.log("알림 메시지 호출됨:", message); // 알림 로그 추가
    setAlerts((prevAlerts) => [...prevAlerts, message]);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.slice(1));
    }, 3000);
  };

  const handleDateClick = async (date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate);
      const response = await getTodayInspections(formattedDate);
      // 응답 구조에 맞게 수정
      if (response.data && response.data.data) {
        console.log(response.data.data);
        setInspections(response.data.data); // API 응답에서 점검 목록을 가져옴
      } else {
        setInspections([]); // 데이터가 없을 경우 빈 배열로 초기화
      }
      setIsModalOpen(true);
      setCurrentPage(0); // 모달 열 때 첫 페이지로 초기화
    } catch (error) {
      console.error("점검 일정 조회 실패:", error);
    }
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleUpdateStats = async () => {
    console.log("통계 업데이트 함수 호출됨"); // 통계 업데이트 시작 로그
    if (reportDashboardRef.current) {
      await reportDashboardRef.current.fetchStats();
      console.log("통계 업데이트 완료됨"); // 통계 업데이트 완료 로그
    } else {
      console.error("reportDashboardRef가 없습니다");
    }
  };

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil((inspections?.length || 0) / ITEMS_PER_PAGE);
  const currentInspections = inspections?.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onViewChange={(view) => setActiveView(view)} activeView={activeView} />
      <div className={`dashboard-container ${activeView === "체크리스트 작성" ? "checklist-view-enabled" : ""}`}>
        {activeView === "체크리스트 작성" ? (
          <div className="checklist-page-container">
            <ChecklistPage />
          </div>
        ) : activeView === "완료목록" ? (
          <div className="checklist-complete-container">
            <ChecklistCompleteList />
          </div>
        ) : activeView === "전체" ? (
          <div className="total-dashboard-view">
            <div className="map-container">
              <NaverMap />
            </div>
            <div className="stats-container">
              <DefectStats />
              <DetectionStats />
            </div>
          </div>
        ) : (
          <div className="my-area-dashboard">
            <div className="inspection-list-row">
              <div className="dashboard-item inspection-list">
                 <InspectionTabs
                  onAlert={handleAlert}
                  userReports={userReports}
                  inspectionReports={inspectionReports}
                  onUpdateStats={handleUpdateStats}
                />
              </div>
            </div>
            <div className="dashboard-bottom-row">
              <div className="dashboard-item">
                <ReportDashboard ref={reportDashboardRef} />
              </div>
              {/* <div className="dashboard-item"> */}
                <MiniCalendar onDateClick={handleDateClick} />
              {/* </div> */}
              <div className="dashboard-item">
                <TodayInspection />
              </div>
              {alerts.length > 0 && (
                <div className="alert-container">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`alert-message ${
                        alert.includes("실패") || alert.includes("없습니다") ? "alert-error" : "alert-success"
                      }`}
                    >
                      {alert}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>점검 상세 정보</h2>
              {inspections.length > 0 ? (
                <>
                  <div className="inspection-items-container">
                    {currentInspections.map((inspection, index) => (
                      <div key={index} className="calendar-inspection-item">
                        <h3>점검 {currentPage * ITEMS_PER_PAGE + index + 1}</h3>
                        <p>날짜: {inspection.schedule_date}</p>
                        <p>상태: {inspection.status}</p>
                        {inspection.report_info && (
                          <>
                            <p>위치: {inspection.report_info.detail_address}</p>
                            <p>신고 내용: {inspection.report_info.description}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="modal-pagination">
                      <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="pagination-button"
                      >
                        이전
                      </button>
                      <span className="page-info">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="pagination-button"
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>해당 날짜에 예약된 점검이 없습니다.</p>
              )}
              <button onClick={handleCloseModal} className="modal-close-button cal-close-btn">닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
