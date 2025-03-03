import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars"; // npm install react-native-calendars
import Footer from "../../../components/molecules/Footer/InspectorFooter";
import FilterModal from "../../../components/molecules/Filter/FilterModal"; // 수정한 FilterModal 적용
import ReportHistoryStyles from "../../../styles/ReportHistoryStyles";
import { fetchRegularInspections, fetchReports } from "../../../api/reportApi";
import apiClient from "../../../api/apiClient"; // apiClient import 추가

const ReportInspectorHistoryScreen = () => {
  const navigation = useNavigation();

  // 데이터 관련 상태
  const [regularInspections, setRegularInspections] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // 페이지 상태 추가

  // 필터 관련 상태
  const [filterOptionModalVisible, setFilterOptionModalVisible] =
    useState(false); // 필터 옵션 모달
  const [dateModalVisible, setDateModalVisible] = useState(false); // 날짜 모달
  const [statusFilterModalVisible, setStatusFilterModalVisible] =
    useState(false); // 현황 필터 모달
  const [selectedFilter, setSelectedFilter] = useState("전체보기"); // 기본 필터 상태
  const [selectedStatus, setSelectedStatus] = useState(null); // 선택된 상태 필터

  // 상세 모달 상태
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // 상세 정보 모달

  // 달력 날짜 범위 선택 상태 (YYYY-MM-DD 형식)
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  // 새로운 상태 변수 추가
  const [regularReportModalVisible, setRegularReportModalVisible] =
    useState(false);

  // 상태 변경 모달 관련 상태 추가
  const [statusChangeModalVisible, setStatusChangeModalVisible] =
    useState(false);

  // 데이터 조회 함수
  const loadData = async () => {
    setLoading(true);
    try {
      const regularData = await fetchRegularInspections();
      if (Array.isArray(regularData.data)) {
        const modifiedRegularData = regularData.data.map((item) => ({
          ...item,
          inspection_id: `Re_${item.inspection_id}`,
          inspector_name: item.inspector_name,
          schedule_date: item.schedule_date,
          report_info: item.report_info,
          status: item.status,
        }));
        setRegularInspections(modifiedRegularData);
      }

      const reportsData = await fetchReports();
      if (Array.isArray(reportsData.data)) {
        const modifiedReportsData = reportsData.data.map((item) => ({
          ...item,
          inspection_id: `Rp_${item.inspection_id}`,
          inspector_name: item.inspector_name,
          schedule_date: item.schedule_date,
          report_info: item.report_info,
          status: item.status,
        }));
        setReports(modifiedReportsData);
        setHasMore(reportsData.data.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("🚨 데이터 조회 실패:", error);
      Alert.alert("오류", "데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 로드
  useEffect(() => {
    loadData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 호출

  // 필터 버튼 클릭 시
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setRegularReportModalVisible(false); // 정기/신고 모달 닫기
  };

  // 상태 필터 클릭 시
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setStatusFilterModalVisible(false);
  };

  // 필터에 따라 데이터 렌더링
  const renderFilteredData = () => {
    console.log("Filtered Reports:", reports); // 데이터 확인용 로그

    let filteredData = [];
    let title = "";

    if (selectedFilter === "정기점검") {
      filteredData = regularInspections;
      title = "정기 점검";
    } else if (selectedFilter === "신고점검") {
      filteredData = reports;
      title = "신고 점검";
    } else {
      filteredData = [...regularInspections, ...reports];
      title = "전체보기";
    }

    // 상태 필터 적용
    if (selectedStatus) {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
    }

    console.log("Filtered Data:", filteredData); // 필터링 결과 확인용 로그

    return (
      <View style={{ flex: 1 }}>
        <View style={ReportHistoryStyles.header}>
          <Text style={ReportHistoryStyles.title}>점검내역</Text>
          <TouchableOpacity
            style={ReportHistoryStyles.filterButton}
            onPress={() => setFilterOptionModalVisible(true)}
          >
            <Text style={ReportHistoryStyles.filterText}>필터</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#7D40E7"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {title && <Text style={ReportHistoryStyles.subTitle}>{title}</Text>}
            <FlatList
              data={filteredData}
              keyExtractor={(item) =>
                item.inspection_id
                  ? item.inspection_id.toString()
                  : `temp_${Math.random()}`
              }
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openReportModal(item)}>
                  <View style={ReportHistoryStyles.reportCard}>
                    <Text style={ReportHistoryStyles.reportIndex}>
                      {item.inspection_id}
                    </Text>
                    <View style={ReportHistoryStyles.reportContent}>
                      <Text style={ReportHistoryStyles.reportDescription}>
                        {item.report_info
                          ? `신고: ${item.report_info.description}`
                          : `점검자: ${item.inspector_name}`}
                      </Text>
                      <View style={ReportHistoryStyles.dateStatusContainer}>
                        <Text style={ReportHistoryStyles.reportDate}>
                          {item.schedule_date}
                        </Text>
                        <Text style={ReportHistoryStyles.reportStatus}>
                          {`상태: ${item.status}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 20 }} // 하단 여백 추가
              onEndReached={() => {
                if (hasMore && !loading) {
                  fetchReports(page); // 페이지 번호 사용
                  setPage((prev) => prev + 1); // 페이지 번호 증가
                }
              }}
              onEndReachedThreshold={0.5}
            />
          </>
        )}
        <Footer />
      </View>
    );
  };

  // 달력에서 날짜 선택 시 (범위 선택)
  const onDayPress = (day) => {
    let start = rangeStart;
    let end = rangeEnd;
    if (!start || (start && end)) {
      // 시작일이 없거나 이미 범위가 선택되었으면 새로 시작
      start = day.dateString;
      end = null;
    } else {
      if (day.dateString < start) {
        start = day.dateString;
      } else {
        end = day.dateString;
      }
    }
    setRangeStart(start);
    setRangeEnd(end);
    setMarkedDates(markRange(start, end));
  };

  // 시작일과 종료일 사이의 날짜에 대해 색칠(marking) 객체 생성
  const markRange = (start, end) => {
    let marks = {};
    if (start) {
      marks[start] = { startingDay: true, color: "blue", textColor: "white" };
    }
    if (start && end) {
      let startDateObj = new Date(start);
      let endDateObj = new Date(end);
      let current = new Date(startDateObj);
      while (current <= endDateObj) {
        let dateString = current.toISOString().split("T")[0];
        if (dateString === start) {
          marks[dateString] = {
            startingDay: true,
            color: "blue",
            textColor: "white",
          };
        } else if (dateString === end) {
          marks[dateString] = {
            endingDay: true,
            color: "blue",
            textColor: "white",
          };
        } else {
          marks[dateString] = { color: "lightblue", textColor: "black" };
        }
        current.setDate(current.getDate() + 1);
      }
    }
    return marks;
  };

  // 초기화 버튼: 달력 선택 범위 초기화 (전체 검색)
  const resetDateFilter = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setMarkedDates({});
  };

  // 확인 버튼 (날짜 모달): 선택된 날짜 범위에 따라 정기 점검 데이터 필터링
  const applyDateFilter = () => {
    if (rangeStart && rangeEnd) {
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);

      // 정기 점검 데이터 필터링
      const filteredRegularInspections = regularInspections.filter((item) => {
        const d = new Date(item.schedule_date);
        return d >= start && d <= end;
      });

      // 신고 점검 데이터 필터링
      const filteredReports = reports.filter((item) => {
        const d = new Date(item.schedule_date);
        return d >= start && d <= end;
      });

      // 필터링된 데이터를 상태에 저장
      setRegularInspections(filteredRegularInspections);
      setReports(filteredReports);
    }
    setDateModalVisible(false);
  };

  // 정기 점검 상세 모달 열기
  const openRegularModal = (inspection) => {
    setSelectedReport(inspection);
    setModalVisible(true);
  };

  // 신고 점검 상세 모달 열기
  const openReportModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setModalVisible(false);
  };

  const handleScheduleBooking = (report) => {
    closeModal();
    navigation.navigate("Inspection/Schedule/reportSchedule", { report });
  };

  // 상태 선택 버튼 클릭 시 API 호출
  const handleStatusChange = async (status) => {
    if (selectedReport) {
      const inspectionId = selectedReport.inspection_id.replace(/Re_|Rp_/, ""); // Re_ 또는 Rp_ 제거
      const url = `/api/inspections/${inspectionId}/status`;

      const requestBody = {
        status: status,
      };

      console.log("Request Body:", requestBody); // 요청 본문 로그 출력

      try {
        const response = await apiClient.patch(url, requestBody); // apiClient를 사용하여 PATCH 요청

        console.log("Response Data:", response.data); // 응답 데이터 로그 출력

        // 데이터 새로 고침
        await loadData(); // 상태 변경 후 데이터 다시 로드

        // 모달 닫기
        setStatusChangeModalVisible(false); // 상태 변경 모달 닫기
      } catch (error) {
        console.error("API 호출 실패:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderFilteredData()}

      {/* 필터 옵션 모달: "정기/신고" 버튼 */}
      <Modal
        animationType="slide"
        transparent
        visible={filterOptionModalVisible}
        onRequestClose={() => setFilterOptionModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterOptionContainer}>
            <Text style={styles.modalTitle}>필터 옵션 선택</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setFilterOptionModalVisible(false); // 필터 옵션 모달 닫기
                setRegularReportModalVisible(true); // 정기/신고 모달 열기
              }}
            >
              <Text style={styles.optionButtonText}>정기/신고</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setFilterOptionModalVisible(false);
                setDateModalVisible(true);
              }}
            >
              <Text style={styles.optionButtonText}>날짜 필터</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setFilterOptionModalVisible(false);
                setStatusFilterModalVisible(true);
              }}
            >
              <Text style={styles.optionButtonText}>현황 필터</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 정기/신고 필터 모달 */}
      <Modal
        animationType="slide"
        transparent
        visible={regularReportModalVisible}
        onRequestClose={() => setRegularReportModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterOptionContainer}>
            <Text style={styles.modalTitle}>정기/신고 선택</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleFilterSelect("전체보기")}
            >
              <Text style={styles.optionButtonText}>전체보기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleFilterSelect("정기점검")}
            >
              <Text style={styles.optionButtonText}>정기점검</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleFilterSelect("신고점검")}
            >
              <Text style={styles.optionButtonText}>신고점검</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 날짜 모달 – 달력과 초기화/확인 버튼 */}
      <Modal
        animationType="slide"
        transparent
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.dateModalContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetDateFilter}
            >
              <Text style={styles.resetButtonText}>초기화</Text>
            </TouchableOpacity>
            <Calendar
              markingType={"period"}
              markedDates={markedDates}
              onDayPress={onDayPress}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={applyDateFilter}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 현황 필터 모달 */}
      <Modal
        animationType="slide"
        transparent
        visible={statusFilterModalVisible}
        onRequestClose={() => setStatusFilterModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterOptionContainer}>
            <Text style={styles.modalTitle}>현황 필터 선택</Text>
            {["예정됨", "진행중", "완료됨", "취소됨"].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.optionButton}
                onPress={() => handleStatusSelect(status)}
              >
                <Text style={styles.optionButtonText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 상세 정보 모달 */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={ReportHistoryStyles.modalBackground}>
          <View style={ReportHistoryStyles.modalContainer}>
            {selectedReport && (
              <>
                <Text style={ReportHistoryStyles.modalTitle}>
                  점검 상세 정보
                </Text>
                <Text style={ReportHistoryStyles.reportDescription}>
                  {`신고 ID: ${selectedReport.inspection_id}`}
                </Text>
                <Text style={ReportHistoryStyles.reportDescription}>
                  {`내용: ${
                    selectedReport.report_info
                      ? selectedReport.report_info.description
                      : "정보 없음"
                  }`}
                </Text>
                <TouchableOpacity
                  style={ReportHistoryStyles.checklistButton}
                  onPress={() => {
                    navigation.navigate("Checklist/index", {
                      inspection: selectedReport,
                    });
                    setModalVisible(false);
                  }}
                >
                  <Text style={ReportHistoryStyles.scheduleButtonText}>
                    체크리스트
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ReportHistoryStyles.statusButton}
                  onPress={() => setStatusChangeModalVisible(true)}
                >
                  <Text style={ReportHistoryStyles.scheduleButtonText}>
                    상태변경
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ReportHistoryStyles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={ReportHistoryStyles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 상태 변경 모달 */}
      <Modal
        animationType="slide"
        transparent
        visible={statusChangeModalVisible}
        onRequestClose={() => setStatusChangeModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterOptionContainer}>
            <Text style={styles.modalTitle}>상태 선택</Text>
            {["예정됨", "진행중", "완료됨", "취소됨"].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.optionButton}
                onPress={() => {
                  handleStatusChange(status); // 상태 변경 함수 호출
                  setStatusChangeModalVisible(false); // 모달 닫기
                }}
              >
                <Text style={styles.optionButtonText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // 공통 모달 배경
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  // 필터 옵션 모달 컨테이너
  filterOptionContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  // 필터 옵션 모달 내 옵션 버튼 스타일
  optionButton: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  optionButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#039568",
  },
  // 날짜 모달 컨테이너
  dateModalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    width: "90%",
  },
  resetButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  resetButtonText: {
    fontSize: 16,
    color: "red",
  },
  // 확인 버튼 (날짜 모달)
  confirmButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  confirmButtonText: {
    fontSize: 18,
    color: "#039568",
    fontWeight: "bold",
  },
});

export default ReportInspectorHistoryScreen;
