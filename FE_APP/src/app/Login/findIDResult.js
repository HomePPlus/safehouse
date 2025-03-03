import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthColors } from "../../styles/AuthColors";
import SignupStyles from "../../styles/SignupStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/molecules/Header/Header";

const FindIDResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; // ✅ 이전 화면에서 전달된 이메일 정보

  // 이메일 마스킹 함수
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const visiblePart = localPart.slice(0, -2); // 마지막 두 글자 제외
    const maskedPart = "**";
    return `${visiblePart}${maskedPart}@${domain}`;
  };

  const maskedEmail = maskEmail(email); // ✅ 가공된 이메일 생성

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

      {/* 이메일 결과 */}
      <View
        style={[
          SignupStyles.inputContainer,
          { alignItems: "center", marginTop: 40 },
        ]}
      >
        <Text
          style={[SignupStyles.description, { fontSize: 18, color: "#fff" }]}
        >
          등록된 이메일:
        </Text>
        <View
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#ffffff",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            elevation: 3,
            width: "90%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: AuthColors.textColor,
            }}
          >
            {maskedEmail}
          </Text>
        </View>
      </View>

      {/* 홈으로 돌아가기 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          SignupStyles.activeButton,
          { marginTop: 50, backgroundColor: "#4CAF50" },
        ]}
        onPress={() => navigation.navigate("Login/index")}
      >
        <Text style={SignupStyles.nextButtonText}>홈으로 돌아가기</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default FindIDResultScreen;
