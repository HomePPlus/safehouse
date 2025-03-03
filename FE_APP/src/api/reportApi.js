import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ✅ 신고 목록 조회 API
export const fetchReports = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // 로그인 시 받은 토큰 가져오기
    const response = await apiClient.get("/api/inspections/report", {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
      },
    });

    console.log("✅ [DEBUG] 신고 목록 조회 응답:", response.data);

    if (response.status === 200) {
      return response.data; // 응답 데이터 반환
    } else {
      throw new Error("🚨 인증되지 않은 요청입니다.");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 목록 조회 실패:", error);
    throw error;
  }
};

// ✅ 신고 상세 조회 API
export const fetchReportDetail = async (reportId) => {
  try {
    const response = await apiClient.get(`/api/reports/${reportId}`, {
      withCredentials: true, // ✅ 쿠키 자동 포함
    });

    console.log("✅ [DEBUG] 신고 상세 조회 응답:", response.data);

    if (response.status === 200) {
      if (response.data.data) {
        return response.data.data; // ✅ { "data": {...} } 형태일 경우
      } else {
        return response.data; // ✅ 직접 객체가 반환될 경우
      }
    } else {
      throw new Error("🚨 인증되지 않은 요청입니다.");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 상세 조회 실패:", error);
    throw error;
  }
};

// ✅ 신고 작성 API
export const createReport = async ({
  reportTitle, 
  reportDetailAddress,
  defectType,
  reportDescription,
  images
}) => {
  try {
    const formData = new FormData();

    // ✅ 텍스트 데이터는 개별적으로 추가
    formData.append("report", JSON.stringify({
      reportTitle, 
      reportDetailAddress,
      defectType,
      reportDescription
    }));

    // ✅ 이미지 파일 추가
    if (images && images.length > 0) {
      images.forEach((imageUri) => {
        const fileName = imageUri.split("/").pop();
        const file = {
          uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
          name: fileName,
          type: "image/jpeg",
        };
        formData.append("images", file);  // 이미지 파일 추가
      });
    }

    // ✅ 디버깅 로그
    console.log("📤 [DEBUG] 최종 전송할 formData 데이터:");
    for (let pair of formData._parts) {
      console.log(`📌 [DEBUG] ${pair[0]}:`, pair[1]);
    }

    // 토큰 확인
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }

    // 신고 API 호출
    const response = await apiClient.post("/api/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 작성 실패:", error);
    throw error;
  }
};


// ✅ 신고 수정 API (본인 게시글만 가능)
export const updateReport = async (reportId, updatedData) => {
  try {
    const response = await apiClient.put(
      `/api/reports/${reportId}`,
      updatedData,
      {
        withCredentials: true, // ✅ 쿠키 포함 (인증)
      }
    );

    console.log("✅ [DEBUG] 신고 수정 성공:", response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("🚨 수정 권한이 없습니다.");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 수정 실패:", error);
    throw error;
  }
};

// ✅ 신고 삭제 API (본인 게시글만 가능)
export const deleteReport = async (reportId) => {
  try {
    const response = await apiClient.delete(`/api/reports/${reportId}`, {
      withCredentials: true, // ✅ 쿠키 포함 (인증)
    });

    console.log("✅ [DEBUG] 신고 삭제 성공:", response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("🚨 삭제 권한이 없습니다.");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] 신고 삭제 실패:", error);
    throw error;
  }
};

// 정기 점검 목록 조회 API
export const fetchRegularInspections = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // 로그인 시 받은 토큰 가져오기
    const response = await apiClient.get("/api/inspections/regular", {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
      },
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("🚨 [DEBUG] 정기 점검 목록 조회 실패:", error);
    throw error; // 에러 발생 시 에러를 던짐
  }
};

// 게시글 목록 조회 API
export const fetchInspectorCommunities = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // 로그인 시 받은 토큰 가져오기
    const response = await apiClient.get("/api/inspector_communities", {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
      },
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("🚨 [DEBUG] 게시글 목록 조회 실패:", error);
    throw error; // 에러 발생 시 에러를 던짐
  }
};

// ✅ AI 결함 탐지 API
export const detectDefects = async (images) => {
  try {
    const formData = new FormData();

    // 이미지 파일 추가
    if (images && images.length > 0) {
      images.forEach((imageUri) => {
        const fileName = imageUri.split("/").pop();
        const type = "image/jpeg";
        formData.append("file", {
          uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
          name: fileName,
          type: type,
        });
      });
    }

    // 토큰 가져오기
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("인증 토큰이 없습니다."); // 토큰이 없으면 에러 발생
    }

    console.log("📤 [DEBUG] AI 결함 탐지 요청 전송:", formData);

    const response = await apiClient.post("/api/model/detect", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
      
    });

    console.log("✅ [DEBUG] AI 결함 탐지 응답:", response.data);
    console.log("✅ [DEBUG] 응답 상태 코드:", response.status);
    console.log("✅ [DEBUG] 응답 헤더:", response.headers);

    if (response.status === 200) {
      return response.data;  // 정상 처리
    } else {
      throw new Error("🚨 AI 결함 탐지 실패");
    }
  } catch (error) {
    console.error("🚨 [DEBUG] AI 결함 탐지 요청 실패:", error);

    if (error.response) {
      // 서버 오류가 있을 때, 오류 메시지 및 상태 코드 확인
      console.error("🚨 [DEBUG] 오류 응답 데이터:", error.response.data);
      console.error("🚨 [DEBUG] 오류 응답 상태 코드:", error.response.status);
    } else {
      // 네트워크 오류 등의 일반적인 오류
      console.error("🚨 [DEBUG] 오류 메시지:", error.message);
    }

    throw error;
  }
};

