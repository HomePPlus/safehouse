import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { AuthColors } from "../../styles/AuthColors";
import SignupStyles from "../../styles/SignupStyles";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SubCard from "../../components/atoms/Card/SubCard";
import Header from "../../components/molecules/Header/Header";

const SignupScreen = () => {
  const navigation = useNavigation();

  const [selectedType, setSelectedType] = useState(null);

  const handleNext = () => {
    if (selectedType === "resident") {
      navigation.navigate("Signup/Resident/index", { userType: selectedType });
    } else if (selectedType === "inspector") {
      navigation.navigate("Signup/Inspector/index", { userType: selectedType });
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
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />
      <Text style={SignupStyles.description}>
        가입하실 회원 유형을 선택해 주세요
      </Text>
      <View style={SignupStyles.buttonContainer}>
        <SubCard
          title="입주민 회원가입"
          subtitle="건물 신고 및 정보 확인"
          selected={selectedType === "resident"}
          onPress={() => setSelectedType("resident")}
          imageSource={require("../../../assets/images/resident.png")}
        />
        <SubCard
          title="점검자 회원가입"
          subtitle="건물 점검 및 관리"
          selected={selectedType === "inspector"}
          onPress={() => setSelectedType("inspector")}
          imageSource={require("../../../assets/images/inspector.png")}
        />
      </View>
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          selectedType
            ? SignupStyles.activeButton
            : SignupStyles.inactiveButton,
        ]}
        onPress={handleNext}
        disabled={!selectedType}
      >
        <Text style={SignupStyles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupScreen;
