import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/molecules/Header/Header";
import Footer from "../../components/molecules/Footer/InspectorFooter";
import { getChecklistPDF } from "../../api/checklistApi";

// ✅ 저장된 체크리스트 목록 불러오기 함수
const getChecklistHistory = async () => {
  try {
    const storedChecklists = await AsyncStorage.getItem("checklistHistory");
    return storedChecklists ? JSON.parse(storedChecklists) : [];
  } catch (error) {
    console.error("🚨 체크리스트 목록 불러오기 실패:", error);
    return [];
  }
};

const ChecklistListScreen = () => {
  const navigation = useNavigation();
  const [checklistData, setChecklistData] = useState([]);

  useEffect(() => {
    const loadChecklists = async () => {
      let history = await getChecklistHistory();

      // ✅ 비동기 요청을 병렬로 실행 (Promise.all)
      const updatedChecklists = await Promise.all(
        history.map(async (checklist) => {
          if (!checklist.reportUrl) {
            const pdfUrl = await getChecklistPDF(checklist.inspectionId);
            if (pdfUrl) {
              return { ...checklist, reportUrl: pdfUrl }; // ✅ 새로운 객체로 반환
            }
          }
          return checklist;
        })
      );

      setChecklistData(updatedChecklists);
    };

    loadChecklists();
  }, []);

  const handleViewChecklistForm = (formData) => {
    // 체크리스트 폼 보기 화면으로 이동
    navigation.navigate("Checklist/checklistFormViewer", { formData });
  };

  const handleViewPdf = (pdfUrl) => {
    // 이미 pdfUrl이 checklistData에 포함되어 있으므로, 추가적인 API 호출이 필요 없음
    if (pdfUrl) {
      navigation.navigate("Checklist/pdfViewer", { pdfUrl });
    } else {
      alert("PDF 파일을 찾을 수 없습니다.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="체크리스트 목록"
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />
      <ScrollView style={styles.container}>
        {checklistData.length === 0 ? (
          <Text style={styles.noDataText}>저장된 체크리스트가 없습니다.</Text>
        ) : (
          checklistData.map((item, index) => (
            <View key={`${item.inspectionId}-${index}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  점검 ID: {item.inspectionId}
                </Text>
                <Text style={styles.cardDate}>
                  📅 제출일: {new Date(item.submittedAt).toLocaleString()}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.viewButton]}
                  onPress={() => handleViewPdf(item.reportUrl)}
                >
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={24}
                    color="white"
                  />
                  <Text style={styles.buttonText}>PDF 보기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.checklistButton]}
                  onPress={() => handleViewChecklistForm(item.formData)}
                >
                  <MaterialIcons name="description" size={24} color="white" />
                  <Text style={styles.buttonText}>체크리스트 폼 보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "column",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    width: "48%",
  },
  viewButton: {
    backgroundColor: "#007BFF",
  },
  checklistButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ChecklistListScreen;
