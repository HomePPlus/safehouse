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
import { joinVerify, checkJoinEmail } from "../../../api/userApi"; // ✅ API 불러오기

const SignupInspector = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const userType = route.params?.userType;

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (!validateEmail(email)) {
      setErrorMessage("유효한 이메일을 입력해 주세요.");
      return;
    }

    setIsLoading(true); // ✅ API 요청 시작 시 로딩 활성화

    try {
      const checkResponse = await checkJoinEmail(email);

      const isAvailable = checkResponse?.data?.data?.available ?? false;

      if (isAvailable === true) {
        const verifyResponse = await joinVerify(email);

        if (verifyResponse.status === 200) {
          Alert.alert("인증 코드 전송 완료", "입력한 이메일을 확인해 주세요.");
          navigation.navigate("Signup/Inspector/verifyEmail", {
            email,
            userType,
          });
        } else {
          Alert.alert("인증 코드 전송 실패", "다시 시도해 주세요.");
        }
      } else {
        Alert.alert(
          "이미 사용 중인 이메일입니다.",
          "다른 이메일을 입력해 주세요."
        );
      }
    } catch (error) {
      Alert.alert(
        "오류 발생",
        error.response?.data?.message || "이메일 인증 중 문제가 발생했습니다."
      );
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
      <Header
        title="회원가입"
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
      />

      <Text style={SignupStyles.description}>이메일을 입력해 주세요.</Text>

      <View>
        {errorMessage ? (
          <Text style={SignupStyles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={SignupStyles.inputContainer}>
        <Input
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="example@domain.com"
          editable={!isLoading} // ✅ 로딩 중 입력 비활성화
        />
      </View>

      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isLoading ? SignupStyles.inactiveButton : SignupStyles.activeButton,
        ]}
        onPress={handleNext}
        disabled={isLoading} // ✅ 로딩 중 버튼 비활성화
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // ✅ 로딩 표시 추가
        ) : (
          <Text style={SignupStyles.nextButtonText}>다음</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupInspector;
