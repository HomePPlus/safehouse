import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReports, deleteReport } from "../../api/apiClient";
import PostList from "../Community/PostList";
import Pagination from "../../components/common/Pagination/Pagination";
import FormGroup from "../../components/FormGroup/FormGroup";
import "./ReportList.css";
import Loading from "../../components/common/Loading/Loading";
import { getUserInfo } from "../../utils/auth";
import SliderToggle from "../../components/common/Button/SliderToggle";
import { useAlert } from '../../contexts/AlertContext';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("mine");
  const { showAlert } = useAlert();

  const userInfo = getUserInfo();
  const loggedInEmail = userInfo?.email;
  const loggedInUserId = userInfo?.userId;

 // 뷰 모드 변경 핸들러
 const handleViewModeToggle = (isAll) => {
  const newMode = isAll ? "all" : "mine";
  console.log('뷰 모드 변경:', newMode);
  setViewMode(newMode);
  setCurrentPage(1);
};


  const handleReportClick = (reportId, isAuthor) => {
    if (!isAuthor) {
      showAlert("본인이 작성한 글만 확인할 수 있습니다.", 'error');
      return;
    }
    navigate(`/report/${reportId}`);
  };

  const fetchReports = async () => {
    try {
      console.groupCollapsed('[API 요청 시작]');
      console.log('요청 파라미터:', { 
        viewMode, 
        userId: loggedInUserId 
      });

      const response = await getAllReports(viewMode, loggedInUserId);
      console.log('API 원본 응답:', response);

      // 데이터 유효성 검사
      if (!response.data?.data) {
        throw new Error('잘못된 응답 구조');
      }

      // 데이터 변환 및 로깅
      const processedData = response.data.data.map((report, index) => {
        console.log(`신고 ${index + 1} 처리:`, {
          raw: report,
          formatted: {
            id: report.report_id,
            title: report.report_title,
            date: new Date(report.report_date).toLocaleDateString(),
            type: report.defect_type,
            userId: report.user_id
          }
        });
        return {
          ...report,
          report_date: new Date(report.report_date) // 날짜 객체 변환
        };
      });

      console.log('처리된 데이터:', processedData);
      setReports(processedData);
      setError(null);
    } catch (error) {
      console.error('[에러 상세 정보]', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setError('신고 목록 불러오기 실패: ' + error.message);
      showAlert('신고 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  useEffect(() => {
    fetchReports();
  }, [viewMode, loggedInUserId]); // 뷰 모드 변경 시 재요청



  const isAuthor = (reportUserId) => {
    return Number(reportUserId) === Number(userInfo?.userId);

  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername = username.slice(0, 3) + "*".repeat(username.length - 3);
    return `${maskedUsername}@${domain}`;
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const filteredReports = viewMode === "mine" ? reports.filter((report) => report.user_id === loggedInUserId) : reports;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);


  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="report-wrapper">
      <div className="reportlist-container">
        <div className="report-board">
          <h1>신고 내역</h1>
      <SliderToggle 
        onToggle={handleViewModeToggle}
        initialMode={viewMode}
      />
          <FormGroup>
            <table className="report-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>결함 유형</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => {
        const isAuthor = Number(report?.user_id) === Number(loggedInUserId);

                  return (
                    <tr key={report.report_id}>
                      <td>{report.report_id}</td>
                      <td>
                        <span
                          onClick={() => handleReportClick(report.report_id, isAuthor)}
                          style={{
                            cursor: isAuthor ? "pointer" : "not-allowed",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {isAuthor ? report.report_title : "비밀글입니다"}
                        </span>
                      </td>
                      <td>{isAuthor ? maskEmail(loggedInEmail) : "-"}</td>
                      <td>{isAuthor ? formatDate(report.report_date) : "-"}</td>
                      <td>{isAuthor ? report?.defect_type : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pagination-container-report">
              <Pagination
                totalPage={Math.ceil(filteredReports.length / reportsPerPage)}
                page={currentPage}
                setPage={setCurrentPage}
              />
            </div>
          </FormGroup>
          <button className="button-report" onClick={() => navigate("/report")}>
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
