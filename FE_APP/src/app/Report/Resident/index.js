import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/molecules/Header/Header";
import Icon from "react-native-vector-icons/MaterialIcons";
import Address from "../../../components/molecules/Address/Address";
import Button from "../../../components/atoms/Button/Button";
import CustomCamera from "../../../components/atoms/Camera/CustomCamera";
import GalleryUpload from "../../../components/atoms/Camera/GalleryUpload";
import DetailedInput from "../../../components/atoms/Input/DetailedInput";
import Input from "../../../components/atoms/Input/Input";
import ReportStyles from "../../../styles/ReportStyles";
import { createReport, detectDefects } from "../../../api/reportApi"; // ✅ 신고 API 추가
import ModelingScreen from "../../Report/Resident/modelingScreen";
import { defectTypes } from "./modelingScreen"; // 경로를 맞춰서 import

const ReportResidentScreen = () => {
  const navigation = useNavigation();

  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProblemTypes, setSelectedProblemTypes] = useState([]); // 다중 선택
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(false); // 버튼 활성화 상태
  const [selectedImages, setSelectedImages] = useState([]); // 선택된 이미지 리스트
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ isSubmitting 상태 추가
  const [aiResult, setAiResult] = useState(null); // ✅ AI 결과 상태 추가

  const totalSteps = 6;
  // "신고 완료" 버튼 동작

  const handleImagesSelected = (uris) => {
    setSelectedImages((prev) => [...prev, ...uris]); // 기존 이미지에 추가
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index)); // 특정 이미지 삭제
  };

  // 단계별 유효성 검사
  useEffect(() => {
    switch (currentStep) {
      case 1: // 주소 입력 단계
        setIsNextEnabled(address.trim() !== "" && detailAddress.trim() !== "");
        break;
      case 2: // 결함 선택 단계
        setIsNextEnabled(selectedProblemTypes.length > 0);
        break;
      case 3: // 첨부파일 단계
        setIsNextEnabled(selectedImages.length > 0);
        break;
      case 4: // 상세 내용 입력 단계
        setIsNextEnabled(description.trim() !== "" && title.trim() !== "");
        break;
      case 5: // 마지막 단계 (확인)
        setIsNextEnabled(true);
        break;
      default:
        setIsNextEnabled(false);
    }
  }, [
    currentStep,
    address,
    detailAddress,
    selectedImages,
    selectedProblemTypes,
    description,
    title,
  ]);
  const handleConfirm = async () => {
    console.log("🚀 [DEBUG] handleConfirm() 실행됨");

    try {
      const reportResponse = await createReport({
        reportTitle: title,
        reportDetailAddress: `${address} ${detailAddress}`,
        defectType: selectedProblemTypes.join(", "),
        reportDescription: description,
        images: selectedImages,
      });
      console.log("✅ [DEBUG] 신고 성공:", reportResponse);

      if (
        !reportResponse ||
        reportResponse.status !== 200 ||
        !reportResponse.data
      ) {
        throw new Error(
          reportResponse?.data?.message || "서버 응답 형식이 올바르지 않습니다."
        );
      }

      // detection_result 처리 수정
      const detectionResult = reportResponse.data.detection_result;
      let translatedResults = [];

      if (detectionResult) {
        // AI가 감지한 결과가 있을 경우
        const detectionResults = detectionResult.split(", ");

        // 각 결과의 출현 횟수를 추적하는 객체
        const resultCounts = {};

        translatedResults = detectionResults.map((result) => {
          // 한글로 변환
          const translatedResult = defectTypes[result] || result;

          // 현재 결과의 출현 횟수 증가
          resultCounts[translatedResult] =
            (resultCounts[translatedResult] || 0) + 1;

          // 첫 번째 출현이면 그대로, 아니면 숫자 추가
          if (resultCounts[translatedResult] === 1) {
            return translatedResult;
          } else {
            return `${translatedResult}${resultCounts[translatedResult]}`;
          }
        });
      } else {
        // null일 경우 로딩 메시지 표시
        translatedResults = ["잠시만 기다려주세요..."];
      }

      // aiResult 상태 업데이트
      setAiResult({
        detectedDefects: translatedResults,
        rawResult: detectionResult || "분석 중",
      });

      Alert.alert("성공", "신고가 완료되었습니다.");
      setCurrentStep(6);
    } catch (error) {
      console.error("🚨 [DEBUG] 신고 제출 오류:", error);
      Alert.alert("오류", `[ERR] ${error.message}`);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleConfirm();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleToggleProblemType = (type) => {
    setSelectedProblemTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={ReportStyles.container}>
          {/* Header */}
          <Header
            title="신고"
            logoSource={require("../../../../assets/images/logo.png")}
            backButtonSource={require("../../../../assets/images/back-arrow.png")}
          />

          {/* 진행 상태 바 */}
          <View style={ReportStyles.progressContainer}>
            <View
              style={[ReportStyles.progressBar, { width: progressWidth }]}
            />
          </View>

          {/* 단계별 내용 */}
          {currentStep === 1 && (
            <View style={ReportStyles.section}>
              <Text style={ReportStyles.title}>주소를 입력해주세요</Text>
              <Text style={ReportStyles.subtitle}>
                정확한 위치를 입력해 주세요.
              </Text>
              <Address
                address={address}
                setAddress={setAddress}
                detailedAddress={detailAddress}
                setDetailedAddress={setDetailAddress}
              />
            </View>
          )}

          {currentStep === 2 && (
            <View style={ReportStyles.section}>
              <Text style={ReportStyles.title}>결함을 선택해주세요</Text>
              <Text style={ReportStyles.subtitle}>
                문제 유형을 선택해 주세요. 여러 개 선택 가능합니다.
              </Text>
              <ScrollView
                style={ReportStyles.problemTypeScroll}
                contentContainerStyle={ReportStyles.problemTypeScrollContent}
              >
                <View style={ReportStyles.problemTypeContainer}>
                  {[
                    {
                      label: "균열",
                      icon: "build",
                      description: "벽면이나 구조물에 균열이 발생함",
                    },
                    {
                      label: "박리",
                      icon: "construction",
                      description: "표면이 벗겨짐",
                    },
                    {
                      label: "백태/누수",
                      icon: "water-damage",
                      description: "물이 새거나 곰팡이가 핌",
                    },
                    {
                      label: "철근 노출",
                      icon: "layers",
                      description: "구조물 철근이 노출됨",
                    },
                    {
                      label: "강재 손상",
                      icon: "bolt",
                      description: "금속 자재가 부식되거나 손상됨",
                    },
                    {
                      label: "도장 손상",
                      icon: "brush",
                      description: "페인트 또는 코팅이 벗겨짐",
                    },
                  ].map((problem) => (
                    <TouchableOpacity
                      key={problem.label}
                      style={[
                        ReportStyles.problemTypeCard,
                        selectedProblemTypes.includes(problem.label) &&
                          ReportStyles.selectedProblemTypeCard,
                      ]}
                      onPress={() => handleToggleProblemType(problem.label)}
                    >
                      <View style={ReportStyles.problemTypeContent}>
                        <View style={ReportStyles.iconCircle}>
                          <Icon
                            name={problem.icon}
                            size={24}
                            color={
                              selectedProblemTypes.includes(problem.label)
                                ? "#fff"
                                : "#4CAF50"
                            }
                          />
                        </View>
                        <View style={ReportStyles.problemTypeTextContainer}>
                          <Text
                            style={[
                              ReportStyles.problemTypeTitle,
                              selectedProblemTypes.includes(problem.label) &&
                                ReportStyles.selectedProblemTypeTitle,
                            ]}
                          >
                            {problem.label}
                          </Text>
                          <Text style={ReportStyles.problemTypeDescription}>
                            {problem.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {currentStep === 3 && (
            <View style={ReportStyles.section}>
              <Text style={ReportStyles.title}>첨부파일을 업로드 해주세요</Text>
              <Text style={ReportStyles.subtitle}>
                사진 또는 문서를 업로드해 주세요.
              </Text>

              <View style={ReportStyles.uploadContainer}>
                <CustomCamera
                  onImageSelected={(uri) => handleImagesSelected([uri])}
                />
                <GalleryUpload onImagesSelected={handleImagesSelected} />
              </View>

              {selectedImages.length > 0 && (
                <ScrollView horizontal style={ReportStyles.imageScroll}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={ReportStyles.imageWrapper}>
                      <Image
                        source={{ uri }}
                        style={ReportStyles.selectedImage}
                      />
                      <TouchableOpacity
                        style={ReportStyles.deleteButton}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={ReportStyles.deleteButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {currentStep === 4 && (
            <View style={ReportStyles.inputSection}>
              {/* 섹션 헤더 */}
              <Text style={ReportStyles.title}>신고 정보를 입력해주세요</Text>

              {/* 신고 제목 입력 */}
              <View style={ReportStyles.inputContainer}>
                <Text style={ReportStyles.label}>제목</Text>
                <Input
                  value={title}
                  onChangeText={setTitle}
                  placeholder="예: 벽면 균열 발생"
                  style={ReportStyles.inputField}
                />
              </View>

              {/* 상세 내용 입력 */}
              <View style={ReportStyles.inputContainer}>
                <Text style={ReportStyles.label}>상세 내용</Text>
                <Text style={ReportStyles.helperText}>
                  어떤 문제가 발생했나요? 자세히 적어 주세요.
                </Text>
                <DetailedInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="예: 2층 벽면에서 균열이 발생하여 보수가 필요합니다."
                  multiline
                  style={ReportStyles.inputField}
                />
              </View>
            </View>
          )}

          {currentStep === 5 && (
            <View style={ReportStyles.section}>
              <Text style={ReportStyles.title}>거의 다 왔어요!</Text>
              <Text style={ReportStyles.subtitle}>
                모든 정보를 확인하고 "다음" 버튼으로 AI 모델링의 결과를
                확인해보세요.
              </Text>

              {/* 요약 정보 카드 */}
              <View style={ReportStyles.summaryCard}>
                {/* 주소 정보 */}
                <View style={ReportStyles.summaryItem}>
                  <Text style={ReportStyles.summaryLabel}>주소:</Text>
                  <Text style={ReportStyles.summaryValue}>
                    {address || "입력 안됨"}
                  </Text>
                </View>
                <View style={ReportStyles.summaryItem}>
                  <Text style={ReportStyles.summaryLabel}>상세 주소:</Text>
                  <Text style={ReportStyles.summaryValue}>
                    {detailAddress || "입력 안됨"}
                  </Text>
                </View>

                {/* 결함 정보 */}
                <View style={ReportStyles.summaryItem}>
                  <Text style={ReportStyles.summaryLabel}>선택한 결함:</Text>
                  <Text style={ReportStyles.summaryValue}>
                    {selectedProblemTypes.length > 0
                      ? selectedProblemTypes.join(", ")
                      : "선택 안됨"}
                  </Text>
                </View>

                <View style={ReportStyles.summaryItem}>
                  <Text style={ReportStyles.summaryLabel}>신고 제목:</Text>
                  <Text style={ReportStyles.summaryValue}>
                    {title || "입력 안됨"}
                  </Text>
                </View>

                {/* 상세 내용 */}
                <View style={ReportStyles.summaryItem}>
                  <Text style={ReportStyles.summaryLabel}>상세 내용:</Text>
                  <Text style={ReportStyles.summaryValue}>
                    {description || "입력 안됨"}
                  </Text>
                </View>

                {/* 선택된 이미지 */}
                {selectedImages.length > 0 && (
                  <View style={ReportStyles.imageSection}>
                    <Text style={ReportStyles.summaryLabel}>
                      선택한 이미지:
                    </Text>
                    <ScrollView horizontal style={ReportStyles.imageScroll}>
                      {selectedImages.map((uri, index) => (
                        <View key={index} style={ReportStyles.imageWrapper}>
                          <Image
                            source={{ uri }}
                            style={ReportStyles.summaryImage}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}
          {currentStep === 6 ? (
            <>
              <ModelingScreen aiResult={aiResult} />
              <View style={ReportStyles.buttonContainer}>
                <Button
                  title="홈 가기"
                  onPress={() => navigation.navigate("Home/Resident/index")}
                  style={ReportStyles.button}
                  textStyle={ReportStyles.buttonText}
                />
              </View>
            </>
          ) : (
            <View style={ReportStyles.buttonContainer}>
              {currentStep > 1 && (
                <Button
                  title="이전"
                  onPress={handlePrevious}
                  style={ReportStyles.button}
                  textStyle={ReportStyles.buttonText}
                />
              )}
              <Button
                title={currentStep === totalSteps - 1 ? "신고완료" : "다음"}
                onPress={handleNext}
                style={[
                  ReportStyles.button,
                  { backgroundColor: "#4CAF50" }, // 다음 버튼만 초록색 배경
                ]}
                textStyle={{ color: "#fff" }} // 다음 버튼만 흰색 텍스트
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ReportResidentScreen;
