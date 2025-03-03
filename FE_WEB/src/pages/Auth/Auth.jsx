import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import { login } from "../../api/apiClient";
import { setUserType, setToken, getToken } from "../../utils/auth";
import Cookies from "js-cookie";
import "./Auth.css";
import { useAlert } from "../../contexts/AlertContext";

import {
  registerResident,
  registerInspector,
  sendVerificationCode,
  verifyEmail,
  checkEmail,
} from "../../api/apiClient";

// 로깅 유틸리티 함수
const logApiResponse = (label, response) => {
  console.group(`🌐 API Response: ${label}`);
  console.log('전체 응답:', response);
  console.log('Status:', response?.status);
  console.log('Response.data:', response?.data);
  console.log('Response.data.data:', response?.data?.data);
  console.log('Response.data.message:', response?.data?.message);
  console.groupEnd();
};

// 에러 로깅 유틸리티 함수
const logApiError = (label, error) => {
  console.group(`❌ API Error: ${label}`);
  console.log('Error:', error);
  console.log('Error Response:', error.response);
  console.log('Error Response Data:', error.response?.data);
  console.log('Error Message:', error.response?.data?.message);
  console.log('Error Status:', error.response?.status);
  console.groupEnd();
};

function Auth() {
  const navigate = useNavigate();
  const {showAlert} = useAlert();


  // 로그인 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);


  // 회원가입 상태
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [codeRequestTime, setCodeRequestTime] = useState(null); // 인증 코드 요청 시간
  const [isCodeExpired, setIsCodeExpired] = useState(false); // 코드 만료 상태

  // 로그인 성공 시 사용자 정보를 쿠키에 저장
  const handleLoginSuccess = (email, userId) => {
    Cookies.set("email", email, { expires: 1 }); // 만료일 설정
    Cookies.set("userId", userId, { expires: 1 }); // 만료일 설정
  };

  // 로그인 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      logApiResponse('로그인', response);

      // response.data.status로 상태 확인
      if (response.data.status === 404) {
        setError("아이디를 찾을 수 없습니다.");
        await showAlert("아이디를 찾을 수 없습니다.", 'error');
        return;
      }
      if (response.data.status === 401) {
        setError(response.data.message, 'error');
        await showAlert(response.data.message, 'error');
        return;
      }
      

      if (response.data.status === 200) {
        const token = response.data.data.token;
        setToken(token);
        setUserType(response.data.data.userType);
        Cookies.set("userId", response.data.data.userId);

        await showAlert('안주에 오신 걸 환영해요!', 'success');
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (err) {
      logApiError('로그인 실패', err);
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
      await showAlert(err.response?.data?.message || "로그인에 실패했습니다.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 핸들러
  const handleEmailVerification = async (email) => {
    try {
      const checkResponse = await checkEmail(email);
      logApiResponse('이메일 중복 체크', checkResponse);

      // response.data.status로 상태 확인
      if (checkResponse.data.status === 400 || checkResponse.data.status === 409) {
        await showAlert(checkResponse.data.message, 'warning');
        return;
      }

      // 이메일 중복 체크 성공
      if (checkResponse.data.status === 200) {
        // 이미 코드가 전송된 경우
        if (checkResponse.data.data?.isCodeSent) {
          await showAlert("이미 인증 코드가 전송된 이메일입니다.", 'info');
          return;
        }

        // 인증 코드 전송
        const response = await sendVerificationCode(email);
        logApiResponse('인증 코드 전송', response);

        if (response.data.status === 200) {
          await showAlert("인증 코드가 이메일로 전송되었습니다.", 'success');
          setShowEmailVerification(true);
          setCodeRequestTime(Date.now());
          setIsCodeExpired(false);
        } else {
          // 200이 아닌 경우 (400 등)
          await showAlert(response.data.message, 'warning');
        }
      }
    } catch (error) {
      logApiError('이메일 인증 실패', error);
      const errorMessage = error.response?.data?.message || "인증 코드 전송에 실패했습니다.";
      setVerificationError(errorMessage);
      await showAlert(errorMessage, 'error');
    }
  };

  // 인증 코드 확인 핸들러
  const handleVerifyCode = async () => {
    try {
      // 반드시 email과 code 모두 전달
      const response = await verifyEmail(registerEmail, verificationCode);
      logApiResponse('인증 코드 확인', response);

      if (response.data.status === 400) {
        await showAlert(response.data.message, 'warning');
        return;
      }

      if (response.data.status === 200) {
        setIsEmailVerified(true);
        setVerificationError("");
        await showAlert(response.data.message || "이메일 인증이 완료되었습니다.", 'success');
      }
    } catch (error) {
      logApiError('인증 코드 확인 실패', error);
      const errorMessage = error.response?.data?.message || "인증 처리 실패";
      setVerificationError(errorMessage);
      await showAlert(errorMessage, 'error');
    }
  };

  // 회원가입 핸들러
  const handleRegister = async (userType, userData) => {
    try {
      await showAlert("회원가입 처리 중입니다...", 'info');

      const registerFn = userType === "resident" ? registerResident : registerInspector;
      const response = await registerFn(userData);
      logApiResponse('회원가입', response);
      
      // response.data.status로 상태 확인
      if (response.data.status === 400 || response.data.status === 409) {
        // 유효성 검사 오류 처리
        if (response.data.data) {
          // 각각의 유효성 검사 오류 메시지를 순차적으로 표시
          const errorData = response.data.data;
          for (const key in errorData) {
            await showAlert(errorData[key], 'warning');
          }
        } else {
          // 일반적인 오류 메시지
          await showAlert(response.data.message || "입력값을 확인해주세요.", 'warning');
        }
        return;
      }
      
      if (response.data.status === 200) {
        await showAlert('회원가입이 완료되었습니다.', 'success');
        return response;
      }
    } catch (error) {
      logApiError('회원가입 실패', error);

      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.status === 409) {
          await showAlert(errorData.message, 'warning');
          return;
        }
        
        if (errorData.status === 400) {
          // 유효성 검사 오류 처리
          if (errorData.data) {
            const validationErrors = errorData.data;
            for (const key in validationErrors) {
              await showAlert(validationErrors[key], 'warning');
            }
          } else {
            await showAlert(errorData.message || "입력값을 확인해주세요.", 'warning');
          }
          return;
        }

        await showAlert(errorData.message || "회원가입에 실패했습니다.", 'error');
      } else {
        await showAlert("서버와의 통신에 실패했습니다.", 'error');
      }
      throw error;
    }
  };

  // 타이머 설정
  useEffect(() => {
    if (codeRequestTime) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - codeRequestTime >= 180000) {
          // 3분(180초) 경과
          setIsCodeExpired(true);
          clearInterval(timer); // 타이머 정리
        }
      }, 1000); // 1초마다 체크

      return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [codeRequestTime]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <AuthForm
          // 로그인 props
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleLogin}
          error={error}
          isLoading={isLoading}
          // 회원가입 props
          registerEmail={registerEmail}
          setRegisterEmail={setRegisterEmail}
          registerPassword={registerPassword}
          setRegisterPassword={setRegisterPassword}
          userName={userName}
          setUserName={setUserName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          companyName={companyName}
          setCompanyName={setCompanyName}
          employeeNumber={employeeNumber}
          setEmployeeNumber={setEmployeeNumber}
          showEmailVerification={showEmailVerification}
          setShowEmailVerification={setShowEmailVerification}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleEmailVerification={handleEmailVerification}
          handleVerifyCode={handleVerifyCode}
          handleRegister={handleRegister}
          isEmailVerified={isEmailVerified}
          verificationError={verificationError}
          isCodeExpired={isCodeExpired} // 만료 상태 전달
        />
      </div>
    </div>
  );
}

export default Auth;
