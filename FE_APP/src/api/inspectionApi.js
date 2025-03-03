import apiClient from "./apiClient"; // axios 인스턴스 불러오기
import AsyncStorage from "@react-native-async-storage/async-storage";

export const jsonDetect = async (requestBody) => {
  return apiClient.post("/api/model/detect/json", requestBody, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

export const uploadImage = async (imageUri) => {
  try {
    const fileName = imageUri.split("/").pop();
    const fileType = fileName.split(".").pop();
    const formData = new FormData();

    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    });

    console.log("🚀 [DEBUG] 이미지 업로드 시작:", fileName);

    const response = await apiClient.post("/api/model/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ [DEBUG] 업로드 완료:", response.data);

    return response.data.data; // 🔥 업로드된 파일명 반환
  } catch (error) {
    console.error("🚨 이미지 업로드 실패:", error);
    Alert.alert("오류", "이미지를 업로드하는 중 문제가 발생했습니다.");
    throw error;
  }
};

// 점검 목록 조회 (타입 필터링)
export const fetchInspections = async (type) => {
  try {
    // 타입 파라미터를 쿼리로 전달하여 점검 목록 조회
    console.log(
      `📤 [DEBUG] 점검 목록 조회 요청: /api/inspections?type=${type}`
    );
    const response = await apiClient.get("/api/inspections", {
      params: { type }, // 쿼리 파라미터로 타입 전달
    });

    console.log("✅ [DEBUG] 점검 목록 조회 응답 데이터:", response.data);
    return response.data; // 점검 목록 반환
  } catch (error) {
    console.error(
      "🚨 [DEBUG] 점검 목록 조회 오류:",
      error.response?.data || error.message
    );
    throw error; // 오류 처리
  }
};

// 점검 상세 조회
export const fetchInspectionDetail = async (inspectionId) => {
  try {
    // 점검 ID로 상세 조회 요청
    console.log(
      `📤 [DEBUG] 점검 상세 조회 요청: /api/inspections/${inspectionId}`
    );
    const response = await apiClient.get(`/api/inspections/${inspectionId}`);

    console.log("✅ [DEBUG] 점검 상세 조회 응답 데이터:", response.data);
    return response.data; // 점검 상세 정보 반환
  } catch (error) {
    console.error(
      "🚨 [DEBUG] 점검 상세 조회 오류:",
      error.response?.data || error.message
    );
    throw error; // 오류 처리
  }
};

// 인증 토큰을 가져오는 함수
// 신고 목록 조회
export const fetchReports = async (pageNum) => {
  try {
    const token = await getAuthToken(); // 인증 토큰 가져오기

    const response = await apiClient.get("/api/reports", {
      params: { page: pageNum, size: 20 }, // 쿼리 파라미터로 페이지 번호와 사이즈 전달
      headers: {
        Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("리포트 조회 실패");
    }
  } catch (err) {
    console.error("Error fetching reports:", err);
    throw err;
  }
};

// 점검 예약
export const scheduleInspection = async (reportId, scheduleDate) => {
  try {
    const token = await getAuthToken(); // 인증 토큰 가져오기
    const requestBody = { reportId, scheduleDate };

    const response = await apiClient.post(
      "/api/inspections/report",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("예약 실패");
    }
  } catch (error) {
    console.error(
      "Error scheduling inspection:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
