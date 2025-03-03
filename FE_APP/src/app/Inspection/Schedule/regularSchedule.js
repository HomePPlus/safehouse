import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { scheduleRegularInspection } from "../../../api/dashboardApi"; // ✅ 정기 점검 API 추가

const RegularScheduleScreen = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState("");
  const [inspectionType, setInspectionType] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // 모달 관리
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleBooking = async () => {
    if (
      !selectedDate ||
      !inspectionType ||
      !selectedDistrict ||
      !selectedTimeSlot
    ) {
      Alert.alert("⚠️ 예약 실패", "모든 필드를 입력하세요.");
      return;
    }

    setLoading(true); // 로딩 시작

    try {
      const response = await scheduleRegularInspection(
        selectedDate,
        `${inspectionType} - ${selectedDistrict} - ${selectedTimeSlot}`
      );
      console.log("✅ [DEBUG] 점검 예약 응답:", response.data);

      setLoading(false); // 로딩 완료
      setSuccessModalVisible(true); // "예약 완료" 모달 표시
    } catch (error) {
      console.error("🚨 [DEBUG] 점검 예약 실패:", error);
      Alert.alert(
        "예약 실패",
        error.response?.data?.message || "점검 예약 중 오류가 발생했습니다."
      );
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>정기 점검 일정 예약</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* 캘린더 */}
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

      {/* 점검 지역 선택 */}
      <Text style={styles.sectionTitle}>점검 지역</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setModalType("district");
          setModalVisible(true);
        }}
      >
        <Text
          style={[
            styles.selectText,
            selectedDistrict ? styles.selectedText : null,
          ]}
        >
          {selectedDistrict || "점검 지역 선택"}
        </Text>
      </TouchableOpacity>

      {/* 점검 유형 선택 (가로 배치 유지) */}
      <Text style={styles.sectionTitle}>점검 유형</Text>
      <View style={styles.rowButtonGroup}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            inspectionType === "설비 점검" && styles.selectedOption,
          ]}
          onPress={() => setInspectionType("설비 점검")}
        >
          <Text
            style={[
              styles.optionText,
              inspectionType === "설비 점검" && styles.selectedOptionText,
            ]}
          >
            설비 점검
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            inspectionType === "안전 점검" && styles.selectedOption,
          ]}
          onPress={() => setInspectionType("안전 점검")}
        >
          <Text
            style={[
              styles.optionText,
              inspectionType === "안전 점검" && styles.selectedOptionText,
            ]}
          >
            안전 점검
          </Text>
        </TouchableOpacity>
      </View>

      {/* 방문 시간 선택 */}
      <Text style={styles.sectionTitle}>방문 시간대</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setModalType("timeSlot");
          setModalVisible(true);
        }}
      >
        <Text
          style={[
            styles.selectText,
            selectedTimeSlot ? styles.selectedText : null,
          ]}
        >
          {selectedTimeSlot || "방문 시간 선택"}
        </Text>
      </TouchableOpacity>

      {/* 예약 버튼 */}
      <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
        <Text style={styles.bookingButtonText}>예약하기</Text>
      </TouchableOpacity>

      {/* 모달 (지역 및 시간 선택) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "district" ? "점검 지역 선택" : "방문 시간 선택"}
            </Text>
            {modalType === "district"
              ? ["남구", "수영구", "해운대구", "동래구"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedDistrict(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))
              : ["오전 (9AM - 12PM)", "오후 (1PM - 5PM)"].map((item) => (
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
    </ScrollView>
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
  calendar: { borderRadius: 12, elevation: 2, backgroundColor: "#fff" },
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

  /* 가로 배치된 점검 유형 선택 */
  rowButtonGroup: { flexDirection: "row", justifyContent: "space-between" },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  optionText: { fontSize: 16, color: "#333", fontWeight: "600" },
  selectedOption: { backgroundColor: "#8ABCAD" },
  selectedOptionText: { color: "#fff" },

  bookingButton: {
    marginTop: 30,
    backgroundColor: "#8ABCAD",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  bookingButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },

  /* 모달 스타일 */
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
});

export default RegularScheduleScreen;
