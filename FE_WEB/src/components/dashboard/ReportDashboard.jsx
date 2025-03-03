import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import InspectionStats from './inspection/InspectionStats';
import { getInspectionStats } from '../../api/apiClient';

const ReportDashboard = forwardRef((props, ref) => {
  const [inspectionStats, setInspectionStats] = useState({
    "예정됨": 0,
    "진행중": 0,
    "완료됨": 0,
    "취소됨": 0,
  });

  const fetchStats = async () => {
    try {
      console.log("통계 데이터 요청 시작");
      const stats = await getInspectionStats();
      console.log("통계 API 응답:", stats);
      
      if (stats) {
        console.log("가공 전 통계 데이터:", stats);
        
        const updatedStats = {
          "예정됨": 0,
          "진행중": 0,
          "완료됨": 0,
          "취소됨": 0,
          ...stats
        };
        
        console.log("가공 후 통계 데이터:", updatedStats);
        setInspectionStats(updatedStats);
        console.log("통계 상태 업데이트 완료");
        
        console.log("통계 변경 사항:", {
          예정됨: `${inspectionStats["예정됨"]} → ${updatedStats["예정됨"]}`,
          진행중: `${inspectionStats["진행중"]} → ${updatedStats["진행중"]}`,
          완료됨: `${inspectionStats["완료됨"]} → ${updatedStats["완료됨"]}`,
          취소됨: `${inspectionStats["취소됨"]} → ${updatedStats["취소됨"]}`
        });
        
        return true;
      }
      
      console.error("통계 데이터가 비어있습니다");
      return false;
    } catch (error) {
      console.error("통계 데이터 로딩 실패. 에러 상세:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error
      });
      return false;
    }
  };

  // ref를 통해 외부에서 호출할 수 있는 함수들
  useImperativeHandle(ref, () => ({
    async fetchStats() {
      console.log("fetchStats ref 함수 호출됨");
      const success = await fetchStats();
      console.log("통계 업데이트 결과:", success);
      return success;
    }
  }));

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    console.log("ReportDashboard 마운트, 초기 통계 로드");
    fetchStats();
  }, []);

  // stats가 변경될 때마다 로그
  useEffect(() => {
    console.log("통계 상태 변경됨:", inspectionStats);
  }, [inspectionStats]);

  return (
    <div>
      <InspectionStats stats={inspectionStats} />
    </div>
  );
});

export default ReportDashboard; 