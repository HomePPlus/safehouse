import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoginStyles from "../../styles/LoginStyles";
import { AuthColors } from "../../styles/AuthColors";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/atoms/Input/Input";
import LogoHeader from "../../components/atoms/LogoHeader/LogoHeader";
import Button from "../../components/atoms/Button/Button";
import { login } from "../../api/userApi"; // 로그인 API 호출 함수
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [userType, setUserType] = useState("resident"); // 'resident' or 'admin'
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      password.length < 26 && // ✅ 길이 조건
      /[A-Za-z]/.test(password) && // ✅ 최소 하나 이상의 문자 포함
      /\d/.test(password) && // ✅ 최소 하나 이상의 숫자 포함
      /[^A-Za-z0-9]/.test(password) // ✅ 최소 하나 이상의 특수문자 포함
    );
  };

  const handleLogin = async () => {
    if (!validateEmail(id)) {
      setEmailError("유효한 이메일을 입력하세요.");
      Alert.alert("입력 오류", "유효한 이메일을 입력하세요.");
      return;
    }

    if (!validatePassword(pw)) {
      setPasswordError(
        "비밀번호는 8자 이상 26자 미만이며, 문자, 숫자, 특수문자를 포함해야 합니다."
      );
      Alert.alert(
        "입력 오류",
        "비밀번호는 8자 이상 26자 미만이며, 문자, 숫자, 특수문자를 포함해야 합니다."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email: id, password: pw });

      console.log("✅ [DEBUG] 전체 로그인 응답:", response); // 전체 응답 확인
      console.log("✅ [DEBUG] 로그인 응답 데이터:", response.data);

      // 쿠키에서 토큰 추출
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        const token = cookies.find((cookie) => cookie.startsWith("JWT_TOKEN="));
        if (token) {
          const jwtToken = token.split("=")[1].split(";")[0]; // JWT_TOKEN=...; 형식에서 값만 추출
          await AsyncStorage.setItem("userToken", jwtToken);
          console.log("✅ [DEBUG] 저장된 토큰:", jwtToken);
        } else {
          console.warn("⚠️ [DEBUG] JWT_TOKEN이 쿠키에 없습니다");
        }
      } else {
        console.warn("⚠️ [DEBUG] 쿠키가 응답에 없습니다");
      }

      // ID 저장
      const userId = response.data?.data?.userId; // ID를 응답에서 가져옴
      if (userId) {
        await AsyncStorage.setItem("userId", userId.toString()); // ID를 AsyncStorage에 저장
      }

      // userName 저장 추가
      const userName = response.data?.data?.userName;
      if (userName) {
        await AsyncStorage.setItem("userName", userName);
      }

      console.log(
        "✅ [DEBUG] 로그인 응답 데이터:",
        JSON.stringify(response.data, null, 2)
      );

      Alert.alert("로그인 성공", "성공적으로 로그인되었습니다.");

      // ✅ 백엔드에서 반환한 userType을 저장
      let userTypeFromBackend = response.data?.data?.userType?.toLowerCase();
      await AsyncStorage.setItem("userType", userTypeFromBackend); // userType을 AsyncStorage에 저장

      console.log(`✅ [DEBUG] 최종 userType 값: ${userTypeFromBackend}`);
      console.log("✅ [DEBUG] 저장된 userType:", userTypeFromBackend);

      // ✅ 점검자일 경우 대시보드로 이동
      if (userTypeFromBackend === "inspector") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home/Inspector/index" }],
        });
      } else if (userTypeFromBackend === "resident") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home/Resident/index" }],
        });
      }
    } catch (error) {
      console.error("🚨 [DEBUG] 로그인 오류:", error);
      Alert.alert(
        "로그인 실패",
        error.message || "로그인 중 문제가 발생했습니다."
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
      style={[
        LoginStyles.container,
        {
          backgroundColor: "#A5D6A7", // fallback 색상
        },
      ]}
    >
      <LogoHeader />

      {/* 입력 필드들의 스타일도 수정 */}
      <View style={{ width: "100%", alignItems: "center" }}>
        {emailError ? (
          <Text style={[LoginStyles.errorText, { color: "#ff6b6b" }]}>
            {emailError}
          </Text>
        ) : null}
        <Input
          value={id}
          onChangeText={(text) => {
            setId(text);
            if (validateEmail(text)) {
              setEmailError("");
            }
          }}
          placeholder="이메일"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />

        {passwordError ? (
          <Text style={[LoginStyles.errorText, { color: "#ff6b6b" }]}>
            {passwordError}
          </Text>
        ) : null}
        <Input
          value={pw}
          onChangeText={(text) => {
            setPw(text);
            if (validatePassword(text)) {
              setPasswordError("");
            } else {
              setPasswordError(
                "비밀번호는 8자 이상 26자 미만이며, 문자, 숫자, 특수문자를 포함해야 합니다."
              );
            }
          }}
          placeholder="비밀번호"
          secureTextEntry
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />
      </View>

      {/* 로그인 버튼 */}
      <Button
        title={
          isLoading ? (
            <ActivityIndicator size="small" color="#388E3C" />
          ) : (
            "로그인"
          )
        }
        onPress={handleLogin}
        disabled={
          isLoading ||
          id.trim() === "" ||
          pw.trim() === "" ||
          passwordError !== ""
        }
        style={{
          backgroundColor:
            id.trim() !== "" && pw.trim() !== "" && passwordError === ""
              ? "#388E3C" // 진한 초록색
              : "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
        textStyle={{
          color:
            id.trim() !== "" && pw.trim() !== "" && passwordError === ""
              ? "#fff" // 조건에 부합할 때 하얀색
              : "#388E3C", // 기본 텍스트 색상
        }}
        size={45}
      />

      {/* 링크 영역 */}
      <View style={LoginStyles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Signup/index")}>
          <Text
            style={[
              LoginStyles.linkText,
              { color: "#388E3C" }, // 진한 초록색
            ]}
          >
            회원가입
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login/findID")}>
          <Text
            style={[
              LoginStyles.linkText,
              { color: "#388E3C" }, // 진한 초록색
            ]}
          >
            ID찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login/findPW")}>
          <Text
            style={[
              LoginStyles.linkText,
              { color: "#388E3C" }, // 진한 초록색
            ]}
          >
            PW찾기
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // 위쪽 정렬
    alignItems: "flex-start", // 왼쪽 정렬
    padding: 20, // 여백 추가
  },
  headerContainer: {
    flexDirection: "row", // 수평 배치
    alignItems: "flex-end", // 수직 하단 정렬
    marginBottom: 20, // 아래 여백 추가
  },
  textContainer: {
    justifyContent: "center", // 텍스트 중앙 정렬
    alignItems: "flex-start", // 텍스트를 위쪽에 정렬
  },
  mascot: {
    width: 80, // 마스코트 이미지 크기 조정
    height: 80, // 마스코트 이미지 크기 조정
    marginRight: 10, // 이미지와 텍스트 간격
  },
  text: {
    fontSize: 20, // 기본 글자 크기
    color: "#fff", // 텍스트 색상 변경: 하얀색
    fontWeight: "bold", // 글자 굵게
  },
  largeText: {
    fontSize: 30, // 키운 글자 크기
    color: "#fff", // 텍스트 색상 변경: 하얀색
    fontWeight: "bold", // 글자 굵게
  },
});

export default LoginScreen;
