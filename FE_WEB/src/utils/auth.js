import Cookies from "js-cookie";

// JWT 토큰 관리
export const getToken = () => Cookies.get("JWT_TOKEN");

// 토큰 설정 함수 추가 (응답 데이터에서 받은 토큰 저장용)
export const setToken = (token) => {
  if (token) {
    Cookies.set("JWT_TOKEN", token, {
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: 1, // 1일
    });
  }
};

export const removeToken = () => {
  Cookies.remove("JWT_TOKEN");
  removeUserType();
};

// userId 가져오는 함수
export const getUserId = () => Cookies.get("userId");

// userType 관리
export const setUserType = (type) => Cookies.set("userType", type);
export const getUserType = () => Cookies.get("userType");
export const removeUserType = () => Cookies.remove("userType");

// INSPECTOR 권한 확인
export const isInspector = () => getUserType() === "INSPECTOR";

// JWT 토큰 디코딩 함수 추가
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];

    // 1. base64url → base64 변환
    let payload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");

    // 2. 패딩 추가 (4의 배수 길이)
    const padLength = (4 - (payload.length % 4)) % 4;
    payload += "=".repeat(padLength);

    // 3. 디코딩
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

// 유저 정보 가져오기
export const getUserInfo = () => {
  const decodedToken = decodeToken();
  if (!decodedToken) return null;

  return {
    email: decodedToken.sub,
    role: decodedToken.role,
    userId: decodedToken.userId, // JWT 토큰에서 userId 추가
  };
};
