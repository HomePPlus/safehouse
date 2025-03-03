import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomCamera from "../../../components/atoms/Camera/CustomCamera";
import { uploadImage, jsonDetect } from "../../../api/inspectionApi";
import Header from "../../../components/molecules/Header/Header";

// ✅ 결함 유형 한글 변환 함수
const translateDefectType = (englishType) => {
  const defectTypes = {
    crack: "균열",
    leak_whitening: "백태/누수",
    efflorescence_level: "백태/누수",
    steel_damage: "강재 손상",
    steeldefectlevel: "강재 손상",
    paint_damage: "도장 손상",
    paintdamage: "도장 손상",
    peeling: "박리",
    spalling: "박리", // ✅ "Spalling"도 변환됨
    rebar_exposure: "철근 노출",
    exposure: "철근 노출",
    unknown: "모름",
  };

  // 🔥 입력값을 소문자로 변환 + 숫자, 밑줄 제거
  const cleanedType = englishType
    .replace(/[0-9_]/g, "")
    .trim()
    .toLowerCase();

  return defectTypes[cleanedType] || englishType; // 변환 실패 시 원래 값 반환
};

const CameraScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageSelected = async (uri) => {
    setImageUri(uri);
    await detectDefect(uri);
  };

  const detectDefect = async (imageUri) => {
    try {
      setLoading(true);
      const uploadedFileName = await uploadImage(imageUri);
      const requestBody = { file1: uploadedFileName };

      const response = await jsonDetect(requestBody);

      setDetectionResult(response.data.data);

      if (response.data.data.image) {
        setProcessedImage(response.data.data.image);
      }
    } catch (error) {
      console.error("🚨 결함 탐지 실패:", error);
      Alert.alert("오류", "결함 탐지 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetCamera = () => {
    setImageUri(null);
    setDetectionResult(null);
    setProcessedImage(null);
  };

  return (
    <View style={styles.container}>
      <Header
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
      />
      {!imageUri ? (
        <>
          <Text style={styles.title}>🔍 AI 결함 탐지</Text>
          <Text style={styles.description}>
            점검할 부분을 촬영하면 AI가 자동으로 결함을 분석합니다.
          </Text>
          <CustomCamera onImageSelected={handleImageSelected} />
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading && <ActivityIndicator size="large" color="#4CAF50" />}

          {/* 📌 AI 분석된 이미지 */}
          {processedImage && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📌 AI 분석된 이미지</Text>
              <Image source={{ uri: processedImage }} style={styles.image} />
            </View>
          )}

          {/* 🔍 결함 탐지 결과 */}
          {detectionResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.sectionTitle}>🔍 결함 탐지 결과</Text>

              {detectionResult.detections.length > 0 ? (
                detectionResult.detections.map((detection, index) => (
                  <View key={index} style={styles.detectionBox}>
                    <Text style={styles.detectionTitle}>
                      📌 결함 정보 {index + 1}
                    </Text>
                    <Text style={styles.detectionText}>
                      🔖 라벨:{" "}
                      <Text style={styles.highlight}>
                        {translateDefectType(detection.label)}
                      </Text>
                    </Text>

                    <Text style={styles.detectionText}>
                      🎯 신뢰도:{" "}
                      <Text style={styles.highlight}>
                        {(detection.confidence * 100).toFixed(2)}%
                      </Text>
                    </Text>
                    <Text style={styles.detectionText}>
                      🏆 점수:{" "}
                      <Text style={styles.highlight}>{detection.score}</Text>
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noDefectContainer}>
                  <Text style={styles.noDefectText}>
                    ⚠️ 결함이 감지되지 않았습니다.
                  </Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={resetCamera}>
            <Text style={styles.resetButtonText}>🔄 다시 촬영</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    alignItems: "center",
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    paddingBottom: 5,
    width: "90%",
    textAlign: "center",
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  resultContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  detectionBox: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detectionText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 3,
  },
  highlight: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  noDefectContainer: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF8888",
    marginTop: 20,
  },
  noDefectText: {
    fontSize: 18,
    color: "#FF4444",
    fontWeight: "bold",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 30,
  },
  resetButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CameraScreen;
