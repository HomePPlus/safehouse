import {
  FaPhoneAlt,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaIdBadge,
  FaLock,
  FaMapMarkerAlt,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import "./AuthForm.css";
import { useAlert } from "../../contexts/AlertContext";

function AuthForm({
  // 로그인 관련 props
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  error,
  isLoading,
  // 회원가입 관련 props
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  userName,
  setUserName,
  phoneNumber,
  setPhoneNumber,
  companyName,
  setCompanyName,
  employeeNumber,
  setEmployeeNumber,
  handleRegister,
  handleEmailVerification,
  verificationCode,
  setVerificationCode,
  showEmailVerification,
  handleVerifyCode,
  isEmailVerified,
  verificationError,
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("resident");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [address, setAddress] = useState({
    roadAddress: "",
    detailAddress: "",
  });
  const { showAlert } = useAlert();

  const switchForm = () => setIsLogin(!isLogin);
  const open = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  // 아이콘 스타일
  const iconStyle = {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#1e5a32",
    fontSize: "1rem",
    zIndex: 10,
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    open({
      onComplete: (data) => {
        let fullAddress = data.address;
        let extraAddress = "";
        if (data.addressType === "R") {
          if (data.bname !== "") extraAddress += data.bname;
          if (data.buildingName !== "")
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setAddress({ ...address, roadAddress: fullAddress });
      },
    });
  };

  // 회원가입 제출 핸들러
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      showAlert("이메일 인증을 완료해주세요.", "warning");
      return;
    }
    try {
      await handleRegister(userType, {
        email: registerEmail,
        password: registerPassword,
        userName,
        phone: phoneNumber,
        detailAddress: `${address.roadAddress} ${address.detailAddress}`,
        ...(userType === "inspector" && {
          inspector_company: companyName,
          inspector_number: employeeNumber,
        }),
      });
      switchForm();
    } catch (error) {
      console.error("Registration error:", error);
      showAlert("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className="auth-main">
      {/* 로그인 폼 */}
      <div
        className={`auth-container auth-b-container ${
          !isLogin ? "auth-is-txl" : ""
        }`}
      >
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          method="POST"
        >
          <h2 className="auth-form-title">로그인</h2>

          <div className="auth-form-group">
            <HiMail style={iconStyle} />
            <input
              type="email"
              placeholder="Email"
              className="auth-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-form-group">
            <FaLock style={iconStyle} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="auth-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>
          
          <button
            type="submit"
            className="auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "로그인"}
          </button>
        </form>
      </div>

      {/* 회원가입 폼 */}
      <div
        className={`auth-container auth-a-container ${
          !isLogin ? "auth-is-txl auth-is-z200" : ""
        }`}
      >
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <div className="auth-user-type">
            <button
              type="button"
              className={`auth-type-button ${
                userType === "resident" ? "active" : ""
              }`}
              onClick={() => setUserType("resident")}
            >
              입주민
            </button>
            <button
              type="button"
              className={`auth-type-button ${
                userType === "inspector" ? "active" : ""
              }`}
              onClick={() => setUserType("inspector")}
            >
              점검자
            </button>
          </div>

          <div className="auth-form-group">
            <FaUser style={iconStyle} />
            <input
              type="text"
              placeholder="User Name"
              className="auth-form-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="auth-form-group">
            <HiMail style={iconStyle} />
            <input
              type="email"
              placeholder="Email"
              className="auth-form-input"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <button
              type="button"
              className="auth-verification-button"
              onClick={() => handleEmailVerification(registerEmail)}
              disabled={isEmailVerified}
            >
              {isEmailVerified ? (
                <>
                  <FaCheckCircle /> 완료
                </>
              ) : (
                "인증코드 전송"
              )}
            </button>
          </div>

          {showEmailVerification && (
            <div className="auth-form-group">
              <FaCheckCircle style={iconStyle} />
              <input
                type="text"
                placeholder="Verification Code"
                className="auth-form-input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                className="auth-verification-button"
                onClick={handleVerifyCode}
              >
                인증코드 확인
              </button>
            </div>
          )}

          <div className="auth-form-group">
            <FaLock style={iconStyle} />
            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Password"
              className="auth-form-input"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            >
              {showRegisterPassword ? "🔓" : "🔒"}
            </button>
          </div>

          <div className="auth-form-group">
            <FaPhoneAlt style={iconStyle} />
            <input
              type="tel"
              placeholder="Phone Number"
              className="auth-form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="auth-form-group">
            <FaMapMarkerAlt style={iconStyle} />
            <input
              type="text"
              placeholder="Road Address"
              className="auth-form-input"
              value={address.roadAddress}
              readOnly
            />
            <button
              type="button"
              className="auth-address-button"
              onClick={handleAddressSearch}
            >
              주소 검색
            </button>
          </div>

          {address.roadAddress && (
            <div className="auth-form-group">
              <FaEdit style={iconStyle} />
              <input
                type="text"
                placeholder="Detail Address"
                className="auth-form-input"
                value={address.detailAddress}
                onChange={(e) =>
                  setAddress({ ...address, detailAddress: e.target.value })
                }
              />
            </div>
          )}

          {userType === "inspector" && (
            <>
              <div className="auth-form-group">
                <FaBuilding style={iconStyle} />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="auth-form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="auth-form-group">
                <FaIdBadge style={iconStyle} />
                <input
                  type="text"
                  placeholder="Employee Number"
                  className="auth-form-input"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-button">
            회원가입
          </button>
        </form>
      </div>

      {/* 폼 전환 섹션 */}
      <div className={`auth-switch ${!isLogin ? "auth-is-txr" : ""}`}>
        <div
          className={`auth-switch__circle ${!isLogin ? "auth-is-txr" : ""}`}
        ></div>
        <div
          className={`auth-switch__circle auth-switch__circle--t ${
            !isLogin ? "auth-is-txr" : ""
          }`}
        ></div>
        <div
          className={`auth-switch__container ${
            !isLogin ? "auth-is-hidden" : ""
          }`}
        >
          <h2 className="auth-switch__title">어서오세요!</h2>
          <p className="auth-switch__description">당신의 안전한 주택, 안주</p>
          <button className="auth-switch-button" onClick={switchForm}>
            회원가입
          </button>
        </div>
        <div
          className={`auth-switch__container ${
            !isLogin ? "" : "auth-is-hidden"
          }`}
        >
          <h2 className="auth-switch__title">반가워요!</h2>
          <p className="auth-switch__description">
            안전한 주거공간의 시작, 지금 시작해보세요
          </p>
          <button className="auth-switch-button" onClick={switchForm}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
