import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleReportInspection } from "../../../api/dashboardApi";

const ReportScheduleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const report = route.params?.report || {};

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalData, setSuccessModalData] = useState({});
  const [reportDescription, setReportDescription] = useState("");

  const handleBooking = async () => {
    if (!selectedDate) {
      Alert.alert("⚠️ 예약 실패", "날짜를 선택하세요.");
      return;
    }

    // 미래 날짜인지 확인
    const today = new Date();
    const selected = new Date(selectedDate);
    if (selected <= today) {
      Alert.alert("⚠️ 예약 실패", "미래 날짜를 선택하세요.");
      return;
    }

    const requestBody = {
      scheduleDate: selectedDate,
      description: reportDescription,
    };

    console.log("✅ [DEBUG] 요청 본문:", JSON.stringify(requestBody)); // 요청 본문 로그 출력

    setLoading(true); // 로딩 시작

    try {
      const token = await AsyncStorage.getItem("userToken"); // AsyncStorage에서 Bearer 토큰 가져오기
      if (!token) {
        throw new Error("인증 토큰이 없습니다."); // 토큰이 없을 경우 오류 처리
      }
      console.log("✅ [DEBUG] Bearer 토큰:", token); // Bearer 토큰 로그 출력

      const url =
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/regular"; // 요청 URL
      console.log("📤 [DEBUG] 요청 URL:", url); // 요청 URL 로그 출력

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Bearer 토큰을 헤더에 포함
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📤 [DEBUG] 요청 헤더:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }); // 요청 헤더 로그 출력

      console.log("📤 [DEBUG] 요청 본문:", JSON.stringify(requestBody)); // 요청 본문 로그 출력

      if (!response.ok) {
        const errorData = await response.json(); // 오류 응답 데이터 가져오기
        console.error("🚨 [DEBUG] 오류 응답:", errorData); // 오류 응답 로그 출력
        throw new Error("예약 요청 실패");
      }

      const data = await response.json();
      console.log("✅ [DEBUG] 예약 응답:", data);

      // 예약 성공 처리
      Alert.alert("예약 완료", "정기 점검이 성공적으로 예약되었습니다.");
      navigation.goBack(); // 예약 후 이전 화면으로 돌아가기
    } catch (error) {
      console.error("🚨 [DEBUG] 예약 실패:", error); // 오류 메시지 로그 출력
      Alert.alert(
        "예약 실패",
        `정기 점검 예약 중 오류가 발생했습니다: ${error.message}`
      );
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>정기 점검 일정 예약</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* 🚀 신고 정보 표시 (위쪽 추가) */}
        <View style={styles.reportInfo}>
          <Text
            style={styles.reportTitle}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {report.description || "날짜를 입력해 주세요."}
          </Text>

          {/* ✅ 신고 내용 길면 "더보기" 버튼 추가 */}
          {report.description && report.description.length > 100 && (
            <TouchableOpacity
              onPress={() => Alert.alert("신고 상세 내용", report.description)}
            >
              <Text style={styles.moreText}>더보기</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 날짜 선택 */}
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#8ABCAD" },
          }}
          theme={{
            selectedDayBackgroundColor: "#8ABCAD",
            todayTextColor: "#8ABCAD",
            arrowColor: "#8ABCAD",
            textDayFontWeight: "600",
            textMonthFontWeight: "bold",
          }}
          style={styles.calendar}
        />

        {/* description 입력 필드 추가 */}
        <Text style={styles.sectionTitle}>정기 점검 내용</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="정기 점검 내용을 입력하세요."
          value={reportDescription}
          onChangeText={setReportDescription}
          multiline
          numberOfLines={2}
        />

        {/* 예약 버튼 */}
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>예약하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 모달 (시간 선택) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>방문 선택</Text>
            {["오전 (9AM - 12PM)", "오후 (1PM - 5PM)"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedTimeSlot(item);
                  setModalVisible(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      {/* 예약 완료 모달 */}
      <Modal visible={successModalVisible} animationType="fade" transparent>
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#8ABCAD" />
            <Text style={styles.successText}>예약 완료!</Text>
            <Text style={styles.successSubText}>
              점검이 성공적으로 예약되었습니다.
            </Text>

            {/* ✅ 예약된 점검 정보 표시 */}
            <Text style={styles.successInfoText}>
              📅 예약 날짜: {successModalData.schedule_date}
            </Text>
            <Text style={styles.successInfoText}>
              🆔 점검 ID: {successModalData.inspection_id}
            </Text>
            <Text style={styles.successInfoText}>
              👤 점검자: {successModalData.inspector_name || "미정"}
            </Text>

            {/* 신고 정보가 있을 경우 추가 표시 */}
            {successModalData.report_info && (
              <>
                <Text style={styles.successInfoText}>
                  📝 신고 내용: {successModalData.report_info.description}
                </Text>
                <Text style={styles.successInfoText}>
                  📍 주소: {successModalData.report_info.detail_address}
                </Text>
                <Text style={styles.successInfoText}>
                  ⚠️ 유형: {successModalData.report_info.defect_type}
                </Text>
              </>
            )}

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

  reportInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  reportTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  reportLocation: { fontSize: 16, color: "#666" },

  calendar: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
    height: 350,
  }, // 🛠 고정 높이 추가

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },

  selectButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectText: { fontSize: 16, color: "#aaa" },
  selectedText: { color: "#333" },

  bookingButton: {
    marginTop: 30,
    backgroundColor: "#8ABCAD",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  bookingButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  reporterName: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  moreText: {
    fontSize: 14,
    color: "#8ABCAD",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  successModalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  successText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  successSubText: { fontSize: 16, color: "#777", marginTop: 5 },
  successButton: {
    marginTop: 20,
    backgroundColor: "#8ABCAD",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  successButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  successInfoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  descriptionInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});

export default ReportScheduleScreen;
