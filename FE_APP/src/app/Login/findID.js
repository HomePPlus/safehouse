import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthColors } from "../../styles/AuthColors";
import SignupStyles from "../../styles/SignupStyles";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/atoms/Input/Input";
import Header from "../../components/molecules/Header/Header";
import { findID } from "../../api/userApi"; // ✅ API 호출 추가

const FindIDScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가

  const isFormValid = userName.trim() && phone.trim();

  const handleFindID = async () => {
    if (!isFormValid) {
      setErrorMessage("모든 필드를 입력해 주세요.");
      return;
    }

    setLoading(true); // 로딩 시작
    try {
      const response = await findID({ userName, phone });

      if (response.status === 200) {
        const { email } = response.data; // ✅ 서버에서 찾은 이메일
        navigation.navigate("Login/findIDResult", { email }); // ✅ 결과 화면으로 이동
      } else {
        setErrorMessage("아이디를 찾을 수 없습니다.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "아이디 찾기 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false); // ✅ 로딩 종료
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
        title="아이디 찾기"
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />

      {/* 설명 */}
      <Text style={SignupStyles.description}>본인의 정보를 입력해 주세요.</Text>

      {/* 에러 메시지 */}
      {errorMessage ? (
        <Text style={SignupStyles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* 입력 필드 */}
      <View style={SignupStyles.inputContainer}>
        <Input
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="이름"
        />
        <Input
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="전화번호"
          keyboardType="phone-pad"
        />
      </View>

      {/* 찾기 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isFormValid ? SignupStyles.activeButton : SignupStyles.inactiveButton,
        ]}
        onPress={handleFindID}
        disabled={!isFormValid || loading} // ✅ 로딩 중에는 비활성화
      >
        <Text style={SignupStyles.nextButtonText}>
          {loading ? "찾는 중..." : "찾기"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default FindIDScreen;
