import apiClient from "./apiClient"; // axios 인스턴스를 가져옴
import AsyncStorage from "@react-native-async-storage/async-storage"; // 저장소

// ✅ 체크리스트 제출 API
export const submitChecklist = async (formData) => {
  console.log("📤 [DEBUG] 체크리스트 API 요청 시작...");
  console.log("📤 [DEBUG] 요청 데이터:", formData);

  try {
    const response = await apiClient.post(
      "/submit_checklist", // 체크리스트 제출 API 엔드포인트
      formData
    );

    const token = await AsyncStorage.getItem("authToken");
    console.log("🔑 [DEBUG] 요청 시 포함된 토큰:", token);

    console.log("✅ [SUCCESS] 체크리스트 제출 성공:", response.data);

    // ✅ 제출 후 inspection_id & report_url 저장 (다음에 보기 기능)
    if (response.data.inspection_id && response.data.report_url) {
      await AsyncStorage.setItem(
        "lastChecklist",
        JSON.stringify({
          inspectionId: response.data.inspection_id,
          reportUrl: response.data.report_url,
        })
      );
      console.log("📌 [INFO] 체크리스트 데이터 저장 완료");
    }

    return response.data;
  } catch (error) {
    console.error("🚨 [ERROR] 체크리스트 제출 실패!");

    if (error.response) {
      // 서버가 응답을 준 경우 (4xx, 5xx 에러)
      console.error("📥 [ERROR] 서버 응답 상태 코드:", error.response.status);
      console.error("📥 [ERROR] 서버 응답 헤더:", error.response.headers);
      console.error("📥 [ERROR] 서버 응답 데이터:", error.response.data);
    } else if (error.request) {
      // 요청이 아예 서버에 도달하지 않은 경우 (네트워크 문제)
      console.error(
        "📡 [ERROR] 요청이 서버에 도달하지 않음. 네트워크 문제 가능"
      );
      console.error("📡 [ERROR] 요청 상세 정보:", error.request);
    } else {
      // 기타 설정 오류
      console.error("⚠️ [ERROR] 요청 설정 중 오류 발생:", error.message);
    }

    console.error("🛠 [DEBUG] 전체 에러 객체:", error);

    throw error;
  }
};

// ✅ 최근 제출한 체크리스트 불러오기 (로컬 저장소)
export const getLastChecklist = async () => {
  try {
    const savedData = await AsyncStorage.getItem("lastChecklist");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("🚨 체크리스트 불러오기 실패:", error);
    return null;
  }
};

export const getChecklistPDF = async (inspectionId) => {
  try {
    // inspectionId가 제대로 전달되었는지 확인
    if (!inspectionId) {
      console.error("🚨 inspectionId가 없습니다.");
      return null;
    }

    // 올바른 URL 경로로 수정
    const response = await apiClient.get(`/download/${inspectionId}`); // /download/inspectionId

    // 서버에서 반환된 PDF URL 반환
    return response.data.pdfUrl;
  } catch (error) {
    console.error("🚨 PDF 가져오기 실패:", error);
    return null;
  }
};
