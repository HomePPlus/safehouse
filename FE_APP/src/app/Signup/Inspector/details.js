import React, { useState, useEffect } from "react";
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
import Address from "../../../components/molecules/Address/Address"; // ✅ 주소 컴포넌트 추가
import { inspectorJoin } from "../../../api/userApi"; // ✅ API 함수 불러오기

const SignupInspectorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password, userType } = route.params || {};

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [certification, setCertification] = useState("");
  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    phoneNumber: false,
    department: false,
    certification: false,
    address: false,
    detailedAddress: false,
  });
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

  // ✅ 이메일과 비밀번호가 존재하는지 체크
  useEffect(() => {
    if (!email || !password) {
      Alert.alert("오류", "이메일 또는 비밀번호가 누락되었습니다.");
      navigation.goBack();
    }
  }, [email, password]);

  const handleComplete = async () => {
    const fullAddress = `${address} ${detailedAddress}`.trim(); // ✅ 주소 + 상세 주소 합치기

    const newErrors = {
      name: !name.trim(),
      phoneNumber: !phoneNumber.trim(),
      department: !department.trim(),
      certification: !certification.trim(),
      address: !address.trim(),
      detailedAddress: !fullAddress.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      Alert.alert("입력 오류", "모든 정보를 입력해주세요.");
      return;
    }

    const signupData = {
      email,
      password,
      userType,
      userName: name,
      phone: phoneNumber,
      inspector_company: department,
      inspector_number: certification,
      detailAddress: fullAddress,
    };

    setIsLoading(true); // ✅ 로딩 시작

    try {
      console.log(
        "📤 [DEBUG] 회원가입 요청 데이터:",
        JSON.stringify(signupData, null, 2)
      );
      const response = await inspectorJoin(signupData);

      console.log("✅ [DEBUG] inspectorJoin 응답:", response);

      if (response?.status === 200) {
        Alert.alert("회원가입 성공", "점검자 회원가입이 완료되었습니다.");
        navigation.navigate("Login/index"); // ✅ 로그인 페이지로 이동
      } else {
        Alert.alert(
          "회원가입 실패",
          response.data?.message || "다시 시도해주세요."
        );
      }
    } catch (error) {
      console.error("🚨 [DEBUG] 회원가입 오류:", error);
      Alert.alert(
        "오류 발생",
        error.response?.data?.message || "회원가입 중 문제가 발생했습니다."
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
      <Text style={SignupStyles.description}>본인의 정보를 입력해 주세요.</Text>

      {/* 입력 필드 */}
      <View style={SignupStyles.inputContainer}>
        {/* 이름 필드 */}
        {errors.name && (
          <Text style={SignupStyles.errorText}>필수 항목입니다.</Text>
        )}
        <Input
          style={[errors.name && { borderColor: "red", borderWidth: 1 }]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: false });
          }}
          placeholder="이름 *"
        />

        {/* 전화번호 필드 */}
        {errors.phoneNumber && (
          <Text style={SignupStyles.errorText}>필수 항목입니다.</Text>
        )}
        <Input
          style={[errors.phoneNumber && { borderColor: "red", borderWidth: 1 }]}
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            if (errors.phoneNumber)
              setErrors({ ...errors, phoneNumber: false });
          }}
          keyboardType="phone-pad"
          placeholder="전화번호 *"
        />

        {/* 소속 회사 (점검자용) */}
        {errors.department && (
          <Text style={SignupStyles.errorText}>필수 항목입니다.</Text>
        )}
        <Input
          style={[errors.department && { borderColor: "red", borderWidth: 1 }]}
          value={department}
          onChangeText={(text) => {
            setDepartment(text);
            if (errors.department) setErrors({ ...errors, department: false });
          }}
          placeholder="소속 회사 *"
        />

        {/* 사원 번호 (점검자용) */}
        {errors.certification && (
          <Text style={SignupStyles.errorText}>필수 항목입니다.</Text>
        )}
        <Input
          style={[
            errors.certification && { borderColor: "red", borderWidth: 1 },
          ]}
          value={certification}
          onChangeText={(text) => {
            setCertification(text);
            if (errors.certification)
              setErrors({ ...errors, certification: false });
          }}
          placeholder="사원 번호 *"
        />

        {/* 주소 입력 컴포넌트 */}
        <Address
          address={address}
          setAddress={setAddress}
          detailedAddress={detailedAddress}
          setDetailedAddress={setDetailedAddress}
        />
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.nextButton,
          isLoading ? SignupStyles.inactiveButton : SignupStyles.activeButton,
        ]}
        onPress={handleComplete}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={SignupStyles.nextButtonText}>회원가입 완료</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupInspectorDetails;
