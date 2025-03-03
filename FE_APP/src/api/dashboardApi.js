import apiClient from "./apiClient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ 점검 예약 관련 API
// 정기 점검 예약
export const scheduleRegularInspection = (scheduleDate, description) =>
  apiClient.post("/api/inspections/regular", {
    scheduleDate,
    description,
  });
// 신고 점검 예약
export const scheduleReportInspection = (reportId, scheduleDate) =>
  apiClient.post("/api/inspections/report", {
    reportId,
    scheduleDate,
  });

// ✅ 점검 조회 관련 API
// 점검 목록 조회
export const getInspectionsByType = (type) =>
  apiClient.get(`/api/inspections?type=${type}`);
// 점검 상세 조회
export const getInspectionDetail = (inspectionId) =>
  apiClient.get(`/api/inspections/${inspectionId}`);
// 정기 점검 목록 조회
export const getRegularInspections = () =>
  apiClient.get("/api/inspections/regular");
// 신고 점검 목록 조회
export const getReportInspections = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiClient.get("/api/inspections/report", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      // console.log("✅ [DEBUG] 신고 점검 목록 조회 응답:", response.data);
      return response.data;
    } else {
      throw new Error("🚨 인증되지 않은 요청입니다.");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 점검 목록 조회 실패:", error);
    throw error;
  }
};

// ✅ 점검 상태 변경 관련 API
// 점검 상태 변경
export const updateInspectionStatus = (inspectionId, status) =>
  apiClient.patch(`/api/inspections/${inspectionId}/status`, {
    status,
  });

// ✅ 점검 통계 관련 API
// 점검자별 점검 상태 통계
export const getInspectorStatistics = () =>
  apiClient.get("/api/inspections/statistics/inspector");
// 지역별 점검 상태 통계
export const getAreaStatistics = (area) =>
  apiClient.get(
    `/api/inspections/statistics/area?area=${encodeURIComponent(area)}`
  );

// ✅ 결함 통계 데이터 가져오기
export const fetchDefectStats = async (area) => {
  try {
    console.log(
      `📤 [DEBUG] GET 요청: /api/dashboard/defects/stats?area=${area}`
    );

    const response = await apiClient.get(`/api/dashboard/defects/stats`, {
      params: { area },
    });

    // console.log("✅ [DEBUG] fetchDefectStats 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🚨 [DEBUG] fetchDefectStats 오류:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 주소를 좌표로 변환하는 함수 추가
export const getGeocode = async (address) => {
  try {
    const GOOGLE_MAPS_API_KEY = "AIzaSyBopxksWDc1L9bsob1ABb085oNKmY6_GJA";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    return null;
  } catch (error) {
    console.error("주소 변환 오류:", error);
    return null;
  }
};
