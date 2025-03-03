import apiClient from "./apiClient";

// ✅ 이메일 중복 확인 (GET 요청)
export const checkJoinEmail = (email) =>
    apiClient.get(`/api/users/check-email?email=${email}`);

// ✅ 이메일 인증코드 전송 (POST 요청)
export const joinVerify = (email) =>
    apiClient.post(`/api/users/send-verification?email=${encodeURIComponent(email)}`);


// ✅ 이메일 인증 코드 검증 (POST 요청, Query Parameter 방식)
export const verifyEmailCode = (email, code) =>
    apiClient.post(`/api/users/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);

// ✅ 회원가입 완료
export const residentJoin = (data) =>
    apiClient.post("/api/users/resident/join", data, {
        headers: { "Content-Type": "application/json" }
    });
export const inspectorJoin = (data) =>
    apiClient.post("/api/users/inspector/join", data);

// ✅ 로그인
export const login = (data) => 
    apiClient.post("/api/auth/login", data);

// ✅ 아이디 찾기
export const findID = (data) => 
    apiClient.post("/api/auth/account/find-id", data);

// ✅ 비밀번호 재설정 코드 전송
export const findPW = (data) =>
    apiClient.post("/api/auth/account/forgot-password", data);

// ✅ 비밀번호 재설정 코드 확인
export const findPWResult = (data) =>
    apiClient.post("/api/auth/account/verify-reset-code", data);
