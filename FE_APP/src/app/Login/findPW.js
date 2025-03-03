import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthColors } from "../../styles/AuthColors";
import SignupStyles from "../../styles/SignupStyles";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/atoms/Input/Input";
import Header from "../../components/molecules/Header/Header";

const FindPWScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(600); // 10분 = 600초

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerification = () => {
    if (!email.trim()) {
      setErrorMessage("이메일을 입력해 주세요.");
    } else if (!isValidEmail(email)) {
      setErrorMessage("유효한 이메일 형식을 입력해 주세요.");
    } else {
      setIsVerificationSent(true);
      setErrorMessage("");
      setTimer(600); // 타이머 초기화 (10분)
      console.log("Verification code sent to:", email);
    }
  };

  const handleVerifyCode = () => {
    if (inputVerificationCode === "123456") {
      setIsVerified(true);
      setVerificationError("");
    } else {
      setVerificationError("인증번호가 틀렸습니다.");
    }
  };

  const handleNext = () => {
    if (isVerified && phoneNumber.trim()) {
      console.log("Move to the next screen");
      navigation.navigate("Login/findPWResult", { email });
    }
  };

  // 타이머 감소 로직
  useEffect(() => {
    let timerInterval;
    if (isVerificationSent && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isVerificationSent, timer]);

  // 타이머 포맷 함수
  const formatTimer = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <LinearGradient
      colors={[
        "#A5D6A7", // 연한 초록색

        "#C8E6C9", // 더 연한 초록색

        "#E8F5E9", // 아주 연한 초록색
      ]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={SignupStyles.container}
    >
      {/* 헤더 */}
      <Header
        title="비밀번호 찾기"
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />

      {/* 설명 */}
      <Text style={SignupStyles.description}>
        이메일과 전화번호를 입력해 주세요.
      </Text>

      {/* 에러 메시지 */}
      {errorMessage ? (
        <Text style={SignupStyles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* 이메일 입력 및 인증 */}
      <View style={SignupStyles.inputContainer}>
        <View style={SignupStyles.row}>
          <TextInput
            style={[SignupStyles.input, { flex: 1 }]}
            placeholder="이메일"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage("");
            }}
          />
          <TouchableOpacity
            style={SignupStyles.smallButton}
            onPress={handleSendVerification}
          >
            <Text style={SignupStyles.buttonText}>
              {timer > 0 ? "인증하기" : "재전송"}
            </Text>
          </TouchableOpacity>
        </View>
        {isVerificationSent && (
          <View style={{ marginTop: 10 }}>
            {verificationError ? (
              <Text style={SignupStyles.errorText}>{verificationError}</Text>
            ) : null}
            {isVerified && (
              <Text style={SignupStyles.verifiedMessage}>인증되었습니다.</Text>
            )}
            <View style={SignupStyles.verificationRow}>
              <TextInput
                style={[
                  SignupStyles.input,
                  SignupStyles.inputWithTimer,
                  isVerified && SignupStyles.verifiedInput,
                  { flex: 1 },
                ]}
                placeholder="인증 번호 입력"
                placeholderTextColor="#999"
                value={inputVerificationCode}
                onChangeText={(text) => {
                  setInputVerificationCode(text);
                  setVerificationError("");
                }}
              />
              <Text style={SignupStyles.timerInside}>
                {timer > 0 ? formatTimer(timer) : "시간 초과"}
              </Text>
              <TouchableOpacity
                style={SignupStyles.smallButton}
                onPress={handleVerifyCode}
              >
                <Text style={SignupStyles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 전화번호 입력 */}
      <View style={SignupStyles.inputContainer}>
        <Input
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          placeholder="전화번호"
          keyboardType="phone-pad"
        />
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isVerified && phoneNumber.trim()
            ? SignupStyles.activeButton
            : SignupStyles.inactiveButton,
        ]}
        onPress={handleNext}
        disabled={!isVerified || !phoneNumber.trim()}
      >
        <Text style={SignupStyles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default FindPWScreen;
