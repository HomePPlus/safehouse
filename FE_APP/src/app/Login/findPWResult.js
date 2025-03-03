import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthColors } from "../../styles/AuthColors";
import SignupStyles from "../../styles/SignupStyles";
import Input from "../../components/atoms/Input/Input";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/molecules/Header/Header";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; // 전달받은 이메일
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("모든 필드를 입력해 주세요.");
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setErrorMessage(
        "비밀번호는 8~24자리의 문자, 숫자, 특수문자를 포함해야 합니다."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("비밀번호 변경 요청:", { email, newPassword });
    // 비밀번호 변경 API 호출 로직 추가
    navigation.navigate("Login/index"); // 성공 시 로그인 화면으로 이동
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

      {/* 이메일 및 새 비밀번호 입력 */}
      <View
        style={[
          SignupStyles.inputContainer,
          {
            marginTop: 40,
            padding: 20,
            backgroundColor: "#ffffff",
            borderRadius: 15,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "#555",
              marginRight: 10,
              width: 80,
            }}
          >
            아이디
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333",
              flex: 1,
            }}
          >
            {email}
          </Text>
        </View>
        <Input
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="새 비밀번호"
        />
        <Input
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="새 비밀번호 확인"
        />
        {errorMessage ? (
          <Text
            style={{
              color: "red",
              marginTop: 10,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>

      {/* 비밀번호 변경 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          SignupStyles.activeButton,
          {
            marginTop: 40,
            backgroundColor: "#4CAF50",
            borderRadius: 25,
            marginBottom: 70,
          },
        ]}
        onPress={handlePasswordChange}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          비밀번호 변경
        </Text>
      </TouchableOpacity>
      {/* 홈으로 돌아가기 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          {
            marginTop: 20, // 간격 추가
            backgroundColor: "#4CAF50",
            borderRadius: 25,
          },
        ]}
        onPress={() => navigation.navigate("Login/index")} // 홈 화면으로 이동
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          홈으로 돌아가기
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ChangePasswordScreen;
