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

const SignupInspectorSetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 이전 화면에서 넘어온 email 값 받기
  const email = route.params?.email || "unknown@example.com";
  console.log(`📤 [DEBUG] 받은 이메일: ${email}`);
  const userType = route.params?.userType;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

  const validatePassword = (pw) => {
    return (
      pw.length >= 8 &&
      /[A-Za-z]/.test(pw) && // 최소 하나 이상의 문자 포함
      /\d/.test(pw) && // 최소 하나 이상의 숫자 포함
      /[!@#$%^&*(),.?":{}|<>]/.test(pw)
    ); // 최소 하나 이상의 특수문자 포함
  };

  const handleNext = async () => {
    if (!validatePassword(password)) {
      setErrorMessage(
        "비밀번호는 문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true); // ✅ 로딩 시작

    try {
      console.log(
        `📤 [DEBUG] 비밀번호 설정 요청: email=${email}, password=${password}`
      );

      // ✅ password를 함께 전달하도록 수정
      navigation.navigate("Signup/Inspector/details", {
        email,
        password,
        userType,
      });

      Alert.alert("비밀번호 설정 완료", "완료되었습니다.");
    } catch (error) {
      console.error("🚨 [DEBUG] 비밀번호 설정 오류:", error);
      setErrorMessage(
        error.response?.data?.message || "비밀번호 설정 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false); // ✅ 로딩 해제
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
        로그인에 사용할 비밀번호를 입력해 주세요
      </Text>

      {/* 에러 메시지 */}
      {errorMessage ? (
        <Text style={SignupStyles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* 비밀번호 입력 */}
      <View style={SignupStyles.inputContainer}>
        <Text style={SignupStyles.hintText}>
          문자, 숫자, 특수문자를 포함해 8자 이상 입력해주세요
        </Text>
        <Input
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="비밀번호"
          secureTextEntry
        />
      </View>

      {/* 비밀번호 확인 */}
      <View style={SignupStyles.inputContainer}>
        <Input
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="비밀번호 확인"
          secureTextEntry
        />
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isLoading ? SignupStyles.inactiveButton : SignupStyles.activeButton,
        ]}
        onPress={handleNext}
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

export default SignupInspectorSetPassword;
