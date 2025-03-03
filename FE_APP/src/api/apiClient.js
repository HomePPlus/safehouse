import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ AsyncStorage 추가

// ✅ 백엔드 기본 주소 설정
const apiClient = axios.create({
  baseURL:
    "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net", // 기본 URL

  withCredentials: true,
});

// ✅ 요청 인터셉터
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📤 [DEBUG] 요청 시작:");
    console.log("🔹 URL:", config.baseURL + config.url);
    console.log("🔹 Method:", config.method.toUpperCase());
    console.log("🔹 Headers:", config.headers);
    console.log("🔹 Body:", config.data);

    return config;
  } catch (error) {
    console.error("🚨 요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
});

// ✅ 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 처리
      await AsyncStorage.removeItem("userToken");
      // 로그인 페이지로 리다이렉트 로직 추가 필요
    }
    return Promise.reject(error);
  }
);

// ✅ 이메일 인증 요청 (쿼리 방식 적용)
export const joinVerify = async (email) => {
  try {
    console.log(
      `📤 [DEBUG] 이메일 인증 요청 (쿼리 방식): /api/users/send-verification?email=${email}`
    );

    const response = await apiClient.post(
      `/api/users/send-verification?email=${encodeURIComponent(email)}`
    );

    console.log("✅ [DEBUG] joinVerify 응답 데이터:", response.data);
    return response;
  } catch (error) {
    console.error(
      "🚨 [DEBUG] joinVerify 오류:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 쿼리 파라미터를 사용하는 함수 예시 (GET 요청)
export const fetchDataWithQuery = async (endpoint, params) => {
  try {
    console.log(`📤 [DEBUG] GET 요청 (쿼리 방식): ${endpoint}`, params);

    const response = await apiClient.get(endpoint, { params });

    console.log("✅ [DEBUG] fetchDataWithQuery 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 데이터 가져오기 오류:", error);
    throw error;
  }
};

export const inspectorJoin = async (signupData) => {
  try {
    console.log(
      "📤 [DEBUG] inspectorJoin 요청 데이터:",
      JSON.stringify(signupData, null, 2)
    );

    const response = await apiClient.post(
      "/api/users/inspector/join",
      signupData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ [DEBUG] inspectorJoin 응답:", response.data);
    return response;
  } catch (error) {
    console.error(
      "🚨 [DEBUG] inspectorJoin 요청 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 신고 작성 API
export const createReport = (formData) =>
  apiClient.post("/api/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 로그인 성공 시 토큰 저장 부분
const storeUserToken = async (token, userType) => {
  try {
    console.log("📢 저장할 토큰:", token);
    console.log("📢 저장할 유저타입:", userType);

    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    if (!userType) {
      console.error("유저타입이 없습니다.");
      return;
    }

    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userType", userType);

    // 저장 후 확인
    const savedToken = await AsyncStorage.getItem("userToken");
    const savedUserType = await AsyncStorage.getItem("userType");
    console.log("📢 저장된 토큰:", savedToken);
    console.log("📢 저장된 유저타입:", savedUserType);
  } catch (error) {
    console.error("토큰 저장 중 오류 발생:", error);
  }
};

export default apiClient;
