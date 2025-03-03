import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthColors } from "../../../styles/AuthColors";
import SignupStyles from "../../../styles/SignupStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Input from "../../../components/atoms/Input/Input";
import Header from "../../../components/molecules/Header/Header";
import { verifyEmailCode, joinVerify } from "../../../api/userApi"; // ✅ API 추가

const SignupResidentVerify = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email = route.params?.email || "unknown@example.com";
  const userType = route.params?.userType;

  // ✅ 이메일 인증 코드 검증 함수
  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setErrorMessage("인증 코드를 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      console.log(
        `📤 [DEBUG] 이메일 인증 코드 검증 요청: email=${email}, code=${verificationCode}`
      );
      const response = await verifyEmailCode(email, verificationCode);

      console.log("✅ [DEBUG] verifyEmailCode 응답:", response);

      if (response.status === 200) {
        Alert.alert("인증 성공", "이메일 인증이 완료되었습니다.");
        navigation.navigate("Signup/Resident/setPassword", { email, userType }); // ✅ 인증 성공 후 이동
      } else {
        setErrorMessage("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("🚨 [DEBUG] 이메일 인증 오류:", error);
      setErrorMessage(
        error.response?.data?.message || "인증 코드가 올바르지 않습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 인증 코드 재전송 함수
  const handleResendCode = async () => {
    setIsLoading(true);

    try {
      console.log(`📤 [DEBUG] 인증 코드 재전송 요청: email=${email}`);
      await joinVerify(email); // ✅ 기존 `joinVerify` API 사용

      Alert.alert(
        "코드 재전송 완료",
        "새로운 인증 코드가 이메일로 전송되었습니다."
      );
    } catch (error) {
      console.error("🚨 [DEBUG] 인증 코드 재전송 오류:", error);
      Alert.alert("재전송 실패", "인증 코드 재전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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
        title="회원가입"
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
      />

      {/* 설명 */}
      <Text style={SignupStyles.description}>
        {email}로 전송된 {"\n"}인증 코드를 입력해 주세요.
      </Text>

      {/* 입력 필드와 에러 메시지 */}
      <View>
        {errorMessage ? (
          <Text style={SignupStyles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={SignupStyles.inputContainer}>
        <Input
          value={verificationCode}
          onChangeText={(text) => {
            setVerificationCode(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="인증 코드 입력"
          keyboardType="number-pad"
        />
      </View>

      {/* 인증 코드 재전송 */}
      <TouchableOpacity
        onPress={handleResendCode}
        style={SignupStyles.resendButton}
        disabled={isLoading}
      >
        <Text style={SignupStyles.resendText}>
          인증 코드를 받지 못하셨나요? 다시 보내기
        </Text>
      </TouchableOpacity>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isLoading ? SignupStyles.inactiveButton : SignupStyles.activeButton,
        ]}
        onPress={handleVerification}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={SignupStyles.nextButtonText}>다음</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupResidentVerify;
