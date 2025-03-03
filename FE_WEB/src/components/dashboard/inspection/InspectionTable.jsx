import React, { useState, useEffect } from "react";
import { getInspectionReports, updateInspectionStatus } from "../../../api/apiClient";
import "./InspectionTable.css";
import Loading from "../../common/Loading/Loading";

const InspectionTable = ({ onUpdateStats, onAlert, statusFilter, setStatusFilter }) => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInspections = async () => {
    try {
      const response = await getInspectionReports();
      const data = response.data.data.map((item) => ({
        ...item,
        report_info: item.report_info || {},
      }));
      console.log("점검 목록 API 응답:", response);
      console.log("첫 번째 점검 데이터:", response?.data.data[0]);
      setInspections(response.data.data);
      console.log("전체: ", response.data.data);
      setError(null);
    } catch (error) {
      setError("점검 목록을 불러오는데 실패했습니다.");
      console.error("Error fetching inspections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleStatusChange = async (inspectionId, newStatus) => {
    try {
      console.log("상태 변경 시도:", { inspectionId, newStatus });
      const response = await updateInspectionStatus(inspectionId, newStatus);
      console.log("상태 변경 API 응답:", response);

      if (response.data.status === 409) {
        console.log("상태 변경 규칙 위반:", response.data.message);
        onAlert(response.data.message);
        return;
      }

      if (response.data.status === 200 || response.status === 200) {
        console.log("상태 변경 성공:", response.data.message);
        onAlert(response.data.message || "점검 상태가 업데이트 되었습니다.");

        console.log("목록 새로고침 시작");
        await fetchInspections();
        console.log("목록 새로고침 완료");

        if (typeof onUpdateStats === "function") {
          console.log("통계 업데이트 시작");
          await onUpdateStats();
          console.log("통계 업데이트 완료");
        } else {
          console.error("onUpdateStats가 함수가 아닙니다");
        }
      } else {
        console.error("상태 변경 실패:", response.data.message);
        onAlert(response.data.message || "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("상태 변경 실패. 에러 상세:", {
        status: error.response?.status || error.response?.data?.status,
        message: error.response?.data?.message,
        error: error
      });

      if (error.response?.data?.message) {
        onAlert(error.response.data.message);
      } else {
        onAlert("상태 변경에 실패했습니다.");
      }
    }
  };

  const getFilteredInspections = () => {
    if (statusFilter === '전체') return inspections;
    return inspections.filter(inspection => inspection.status === statusFilter);
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inspection-table-container">
      <table className="inspection-table">
        <thead>
          <tr>
            <th>점검 ID</th>
            <th>유형</th>
            <th>상태</th>
            <th>예정일</th>
            <th>완료일</th>
            <th>점검자</th>
            <th>신고 내용</th>
            <th>주소</th>
            <th>결함 유형</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredInspections().map((inspection) => {
            const reportInfo = inspection.report_info || {};
            return (
              <tr key={inspection.inspection_id} className={`status-${inspection.status}`}>
                <td>{inspection.inspection_id}</td>
                <td>{inspection.type}</td>
                <td>
                  <select
                    className={`status-select ${inspection.status}`}
                    value={inspection.status}
                    onChange={(e) => handleStatusChange(inspection.inspection_id, e.target.value)}
                  >
                    <option value="예정됨">예정됨</option>
                    <option value="진행중">진행중</option>
                    <option value="완료됨">완료됨</option>
                    <option value="취소됨">취소됨</option>
                  </select>
                </td>
                <td>{inspection.schedule_date}</td>
                <td>{inspection.end_date || "-"}</td>
                <td>{inspection.inspector_name}</td>
                <td>{reportInfo.description || "-"}</td>
                <td>{reportInfo.detail_address || "-"}</td>
                <td>{reportInfo.defect_type || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InspectionTable;
