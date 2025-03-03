import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Footer from "../../../components/molecules/Footer/InspectorFooter";
import ReportStyles from "../../../styles/ReportStyles";
import apiClient from "../../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import CommunityStyles from "../../../styles/CommunityStyles";

// 구 목록
const districts = [
  "강서구",
  "금정구",
  "기장군",
  "남구",
  "동구",
  "동래구",
  "부산진구",
  "북구",
  "사상구",
  "사하구",
  "서구",
  "수영구",
  "연제구",
  "영도구",
  "중구",
  "해운대구",
];
const busanDistricts = [
  "강서구",
  "금정구",
  "기장군",
  "남구",
  "동구",
  "동래구",
  "부산진구",
  "북구",
  "사상구",
  "사하구",
  "서구",
  "수영구",
  "연제구",
  "영도구",
  "중구",
  "해운대구",
];
const EmptyPage = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateString, setDateString] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDefect, setSelectedDefect] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // 구 정보 추출 함수
  const extractDistrict = (address) => {
    const parts = address.split(" ");
    const districtIndex = parts.findIndex((part) => part.endsWith("구"));
    return districtIndex !== -1 ? parts[districtIndex] : null;
  };
  const clearFilter = () => {
    setIsFiltered(false);
    setSelectedRegion("");
    setSelectedDefect("");
    setSelectedDistricts([]);
    setSelectedDistrict(null);
    closeFilterModal();
  };

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  const openSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);
  const fetchReports = async (pageNum) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        `https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/reports?page=${pageNum}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { data } = response.data;
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setReports((prev) => [...prev, ...data]);
          setPage(pageNum + 1);
        }
      }
    } catch (err) {
      setError("오류가 발생했습니다.");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0);
  }, []);

  const handleSchedule = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("Selected Report:", selectedReport);
    const reportId = selectedReport.report_id;
    console.log("Selected Date String:", dateString);
    const scheduleDate = dateString;

    const requestBody = {
      reportId: reportId,
      scheduleDate: scheduleDate,
    };

    console.log("Sending request body:", requestBody);

    setLoading(true);

    try {
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }
      console.log(
        "API 요청 URL:",
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/report"
      );
      console.log("API 요청 헤더:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
      console.log("API 요청 바디:", requestBody);
      const response = await apiClient.post(
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/report",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Schedule response:", response.data);

      if (response.status === 200) {
        const { message, data } = response.data;
        Alert.alert("예약 완료", message);
        // console.log("예약된 점검 정보:", data);
      } else {
        Alert.alert("예약 실패", "예상치 못한 오류가 발생했습니다.");
        console.error(
          "Unexpected response status:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error(
        "Error scheduling inspection:",
        error.response ? error.response.data : error.message
      );
      console.log("Request body on error:", requestBody);
      Alert.alert(
        "예약 실패",
        error.response ? error.response.data.message : "예약에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const applyFilter = () => {
    setIsFiltered(true);
    setFilterModalVisible(false);
  };

  const filteredReports = reports.filter((report) => {
    // 지역 필터링
    const districtMatch =
      !selectedRegion ||
      selectedRegion === "부산 구 전체" ||
      report.report_detail_address.includes(selectedRegion);

    // 결함 필터링 - 제목, 설명, 결함 유형에서 검색
    const defectMatch =
      !selectedDefect ||
      report.report_title
        ?.toLowerCase()
        .includes(selectedDefect.toLowerCase()) ||
      report.report_description
        ?.toLowerCase()
        .includes(selectedDefect.toLowerCase()) ||
      report.defectType?.toLowerCase().includes(selectedDefect.toLowerCase());

    return districtMatch && defectMatch;
  });

  const searchResults = reports.filter((report) =>
    report.report_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <View style={ReportStyles.reportCard}>
      <TouchableOpacity
        style={ReportStyles.reportContent}
        onPress={() => {
          setSelectedReport(item);
          setModalVisible(true);
        }}
      >
        <Text style={ReportStyles.reportIndex}>{index + 1}</Text>
        <View style={ReportStyles.reportDetails}>
          <Text style={ReportStyles.reportTitle}>{item.report_title}</Text>
          <Text style={ReportStyles.reportAddress}>
            {item.report_detail_address}
          </Text>
          <Text style={ReportStyles.reportDate}>
            {new Date(item.report_date).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleRegionSelect = (region) => {
    if (region === "부산 구 전체") {
      setSelectedRegion("");
    } else {
      setSelectedRegion(region === selectedRegion ? "" : region);
    }
  };

  const handleDefectSelect = (defect) => {
    setSelectedDefect(defect === selectedDefect ? "" : defect);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>신고내역</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setIsSearching(!isSearching)}
            style={styles.filterButton}
          >
            <Icon name="search" size={25} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.filterButton}
          >
            <Icon
              name="filter"
              size={25}
              color="000"
              style={{ marginLeft: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator color="#4CAF50" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View>
          {isSearching && (
            <TextInput
              style={styles.searchInput}
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}
          {/* 필터링된 신고 내역 렌더링 */}
          {filteredReports.length > 0 ? (
            <FlatList
              data={searchQuery ? searchResults : filteredReports}
              keyExtractor={(item, index) => `${item.report_id}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 80 }}
              onEndReached={() => {
                if (hasMore && !loading) {
                  fetchReports(page);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                hasMore && <ActivityIndicator size="large" color="#4CAF50" />
              }
            />
          ) : (
            <Text>신고 내역이 없습니다.</Text>
          )}
        </View>
      )}
      <Footer />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedReport && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedReport.report_title}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedReport.report_description}
                </Text>
                <Text style={styles.modalAddress}>
                  {selectedReport.report_detail_address}
                </Text>
                <Text style={styles.modalDate}>
                  {new Date(selectedReport.report_date).toLocaleDateString()}
                </Text>
                <Text style={styles.modalReportId}>
                  Report ID: {selectedReport.report_id}
                </Text>
              </>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={() => {
                  setModalVisible(false);
                  setDateModalVisible(true);
                }}
              >
                <Text style={styles.closeButtonText}>예약하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f44336" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {dateModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={dateModalVisible}
          onRequestClose={() => setDateModalVisible(false)}
        >
          <View style={styles.calendarContainer}>
            <Text style={styles.scheduleText}>스케줄</Text>
            {selectedReport && (
              <Text style={styles.modalReportId}>
                Report ID: {selectedReport.report_id}
              </Text>
            )}
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setDateString(day.dateString);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  marked: true,
                  selectedColor: "#4CAF50",
                },
              }}
            />
            {selectedDate && (
              <Text style={styles.selectedDateText}>
                선택한 날짜: {selectedDate}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleSchedule}
              >
                <Text style={styles.closeButtonText}>예약완료하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.newCloseButton}
                onPress={() => setDateModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 필터 모달 */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeFilterModal}
      >
        <View style={CommunityStyles.modalContainer}>
          <View style={CommunityStyles.modalContent}>
            <Text style={CommunityStyles.modalTitle}>필터</Text>

            {/* 부산 구 필터 */}
            <Text style={CommunityStyles.filterLabel}>부산 구 선택</Text>
            <FlatList
              data={["부산 구 전체", ...busanDistricts]}
              keyExtractor={(item) => item}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    CommunityStyles.filterOption,
                    (selectedRegion === "" && item === "부산 구 전체") ||
                    selectedRegion === item
                      ? CommunityStyles.selectedOption
                      : null, // 선택된 항목 스타일
                  ]}
                  onPress={() => handleRegionSelect(item)}
                >
                  <Text
                    style={[
                      CommunityStyles.filterOptionText,
                      (selectedRegion === "" && item === "부산 구 전체") ||
                      selectedRegion === item
                        ? { color: "#FFF" }
                        : { color: "#333" }, // 선택된 텍스트 색상
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* 결함 선택 */}
            <Text style={CommunityStyles.filterLabel}>결함별 검색</Text>
            <FlatList
              data={["균열", "박리", "백태/누수", "철근", "강재", "도장"]}
              keyExtractor={(item) => item}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    CommunityStyles.filterOption,
                    selectedDefect === item && CommunityStyles.selectedOption, // 선택된 항목 스타일
                  ]}
                  onPress={() => handleDefectSelect(item)}
                >
                  <Text style={CommunityStyles.filterOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={CommunityStyles.filterButtonContainer}>
              <TouchableOpacity
                style={CommunityStyles.applyButton}
                onPress={applyFilter}
              >
                <Text style={CommunityStyles.buttonText}>적용</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={CommunityStyles.resetButton}
                onPress={clearFilter}
              >
                <Text style={CommunityStyles.buttonText}>초기화</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    padding: 20,
    backgroundColor: "#039568",
    alignItems: "flex-start",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalAddress: {
    fontSize: 14,
    color: "#666",
  },
  modalDate: {
    fontSize: 12,
    color: "#999",
  },
  modalReportId: {
    fontSize: 12,
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  newCloseButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  scheduleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  districtButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedDistrictButton: {
    backgroundColor: "#2E7D32",
  },
  districtButtonText: {
    color: "#fff",
  },
  applyButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  applyButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  resetButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  resetButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
});

export default EmptyPage;
