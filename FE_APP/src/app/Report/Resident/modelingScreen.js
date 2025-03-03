import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native"; // ✅ 로딩 추가
import Icon from "react-native-vector-icons/MaterialIcons"; // 아이콘 사용

export const defectTypes = {
  CRACK: "균열",
  crack: "균열",
  LEAK_WHITENING: "백태/누수",
  leak_whitening: "백태/누수",
  Efflorescence_Level: "백태/누수",
  EfflorescenceLevel: "백태/누수",
  STEEL_DAMAGE: "강재 손상",
  steel_damage: "강재 손상",
  SteelDefectLevel: "강재 손상",
  PAINT_DAMAGE: "도장 손상",
  paint_damage: "도장 손상",
  PaintDamage: "도장 손상",
  PEELING: "박리",
  peeling: "박리",
  Spalling: "박리",
  REBAR_EXPOSURE: "철근 노출",
  rebar_exposure: "철근 노출",
  Exposure: "철근 노출",
  UNKNOWN: "모름",
  unknown: "모름",
};

const ModelingScreen = ({ aiResult }) => {
  const getDefectType = (type) => {
    return defectTypes[type] || type; // 결함 유형을 한글로 변환, 없으면 그대로 반환
  };

  return (
    <View style={styles.container}>
      <View style={styles.modelView}>
        <Image
          source={require("../../../../assets/images/logo-modeling.png")}
          style={styles.image}
        />
        <Text style={styles.resultText}>AI 모델링 결과를 알려드립니다.</Text>

        {/* AI 결과 표시 */}
        <View style={styles.resultContainer}>
          {aiResult?.detectedDefects && aiResult.detectedDefects.length > 0 ? (
            <>
              <Text style={styles.defectTypeTitle}>결함 유형:</Text>
              <View style={styles.defectBox}>
                <View style={styles.defectTypeRow}>
                  <Icon
                    name="warning"
                    size={24}
                    color="#FFF"
                    style={styles.icon}
                  />
                  <Text style={styles.defectTypeText}>
                    {aiResult.detectedDefects
                      .map((defect) => getDefectType(defect))
                      .join(", ")}
                  </Text>
                </View>
              </View>

              <Text style={styles.resultDescription}>
                빠른 시일 내에 전문가가 방문하여 살펴보겠습니다!
              </Text>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF5722" />
              <Text style={styles.loadingText}>결과를 불러오지 못했습니다.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  modelView: {
    flex: 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  image: {
    width: "70%",
    height: 120,
    resizeMode: "contain",
    borderRadius: 10,
    marginVertical: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#388E3C",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  resultContainer: {
    width: "85%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  defectTypeTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#388E3C",
    textAlign: "center",
    marginBottom: 15,
  },
  defectBox: {
    backgroundColor: "#A5D6A7", // 연두색 배경
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "80%", // 박스 크기 조정
    justifyContent: "center",
    alignItems: "center",
  },
  defectTypeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  defectTypeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF", // 강조된 색상
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: 10,
  },
  resultDescription: {
    fontSize: 18,
    fontWeight: "500",
    color: "#388E3C",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#FF5722",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ModelingScreen;
