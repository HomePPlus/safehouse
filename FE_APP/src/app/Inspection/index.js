import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Platform,
  LogBox,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import Footer from "../../components/molecules/Footer/InspectorFooter";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import {
  fetchDefectStats,
  getReportInspections,
  getGeocode,
} from "../../api/dashboardApi";
import apiClient from "../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardMap from "../../components/atoms/Map/dashboardMap";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Postcode defaultProps 경고 무시
LogBox.ignoreLogs([
  "Warning: Postcode: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("정기 점검");
  const [selectedArea, setSelectedArea] = useState("부산시");
  const [defectStats, setDefectStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectionStatus, setInspectionStatus] = useState({
    예정됨: 0,
    진행중: 0,
    완료됨: 0,
    취소됨: 0,
  });
  const [markers, setMarkers] = useState([]);

  const areaList = [
    "부산시",
    "동래구",
    "해운대구",
    "수영구",
    "사하구",
    "부산진구",
    "남구",
    "북구",
    "강서구",
    "연제구",
    "사상구",
    "금정구",
    "동구",
    "서구",
    "영도구",
    "중구",
    "기장군",
  ];

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDefectStats(selectedArea);
    fetchInspectionStatistics();
  }, [selectedArea]);

  const loadDefectStats = async (area) => {
    setLoading(true);
    try {
      const result = await fetchDefectStats(area);

      if (result.status === 200 && result.data?.defectCounts) {
        const chartData = Object.entries(result.data.defectCounts).map(
          ([key, value], index) => ({
            name: key,
            population: value,
            color: chartColors[index % chartColors.length],
            legendFontColor: "#333",
            legendFontSize: 14,
          })
        );
        setDefectStats(chartData);
      } else {
        setDefectStats([]);
      }
    } catch (error) {
      console.error("🚨 결함 데이터 불러오기 오류:", error);
      setDefectStats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectionStatistics = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/statistics/area",
        {
          params: { area: selectedArea },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("점검 진행 현황 응답:", response.data);

      if (response.status === 200) {
        const data = response.data.data[selectedArea] || {};
        setInspectionStatus({
          예정됨: data["예정됨"] || 0,
          진행중: data["진행중"] || 0,
          완료됨: data["완료됨"] || 0,
          취소됨: data["취소됨"] || 0,
        });
      }
    } catch (error) {
      console.error("🚨 점검 진행 현황 데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedTab === "정기 점검" ? 0 : SCREEN_WIDTH * 0.42,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const loadInspectionMarkers = async () => {
    try {
      const response = await getReportInspections();
      // console.log("✅ API 응답:", response);

      if (response.status === 200) {
        const markersData = await Promise.all(
          response.data.map(async (inspection) => {
            if (!inspection.report_info?.detail_address) {
              console.log("주소 없음:", inspection);
              return null;
            }

            const coords = await getGeocode(
              inspection.report_info.detail_address
            );
            // console.log("✅ 좌표 변환 결과:", coords);

            if (!coords || !coords.latitude || !coords.longitude) {
              console.log(
                "좌표 변환 실패:",
                inspection.report_info.detail_address
              );
              return null;
            }

            const markerData = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              title: inspection.report_info.defect_type || "점검",
              description: `[${inspection.type}] ${
                inspection.report_info.description || ""
              }\n상태: ${inspection.status}\n예정일: ${
                inspection.schedule_date
              }`,
              type: inspection.type,
              color: inspection.type === "정기" ? "#4CAF50" : "#FF5252",
            };

            // console.log("✅ 생성된 마커 데이터:", markerData);
            return markerData;
          })
        );

        const validMarkers = markersData.filter(Boolean);
        // console.log("✅ 최종 마커 데이터:", validMarkers);
        setMarkers(validMarkers);
      }
    } catch (error) {
      console.error("🚨 마커 로드 오류:", error.message);
    }
  };

  // 탭 변경 시에도 마커 데이터를 로드하도록 수정
  useEffect(() => {
    if (selectedTab === "신고 점검") {
      loadInspectionMarkers();
    }
  }, [selectedTab]);

  // 기존 마운트 시 로드하는 useEffect는 유지
  useEffect(() => {
    loadInspectionMarkers();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* ✅ 대시보드 타이틀 */}
        <Text style={styles.title}>DASHBOARD</Text>

        {/* ✅ 내 점검 현황 보기 버튼 */}
        <TouchableOpacity
          style={styles.viewMyDashboardButton}
          onPress={() => navigation.navigate("Inspection/Status/myDashboard")}
        >
          <Text style={styles.viewMyDashboardText}>내 점검 현황 보기 →</Text>
        </TouchableOpacity>

        {/* ✅ 점검 진행 현황 */}
        <View style={[styles.statusContainer, { backgroundColor: "#FFFFFF" }]}>
          <Text style={styles.statusTitle}>부산시 총 점검 진행 현황</Text>
          <View style={[styles.statusBox, { backgroundColor: "#FFFFFF" }]}>
            <Text style={styles.statusItem}>
              ✅ 완료: {inspectionStatus.완료됨}건
            </Text>
            <Text style={styles.statusItem}>
              ⏳ 진행: {inspectionStatus.진행중}건
            </Text>
            <Text style={styles.statusItem}>
              📌 예정: {inspectionStatus.예정됨}건
            </Text>
            <Text style={styles.statusItem}>
              ❌ 취소: {inspectionStatus.취소됨}건
            </Text>
          </View>
        </View>

        {/* ✅ 결함 통계 (Pie Chart) */}
        <View style={styles.card}>
          {/* ✅ 드롭다운을 차트 내부에 배치 */}
          <View style={styles.pickerContainer}>
            <Text style={styles.cardTitle}>{selectedArea} 결함 통계</Text>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedArea(value)}
                items={areaList.map((area) => ({ label: area, value: area }))}
                value={selectedArea}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#8ABCAD" />
          ) : (
            <PieChart
              data={defectStats}
              width={SCREEN_WIDTH - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
        </View>

        {/* ✅ 정기 점검 / 신고 점검 전환 바 */}
        <View style={styles.switchContainer}>
          <Animated.View
            style={[styles.switchIndicator, { transform: [{ translateX }] }]}
          />
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setSelectedTab("정기 점검")}
          >
            <Text
              style={[
                styles.switchText,
                selectedTab === "정기 점검" && styles.activeText,
              ]}
            >
              정기 점검
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setSelectedTab("신고 점검")}
          >
            <Text
              style={[
                styles.switchText,
                selectedTab === "신고 점검" && styles.activeText,
              ]}
            >
              신고 점검
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ 선택된 점검 유형에 따른 UI */}
        <View style={styles.roundedContainer}>
          {selectedTab === "정기 점검" ? (
            <>
              {/* ✅ 일정 추가 버튼 (정기 점검) */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate("Inspection/Schedule/reportSchedule")
                }
              >
                <Text style={styles.addButtonText}>+ 정기 점검 일정 추가</Text>
              </TouchableOpacity>

              {/* ✅ 부산 구별 정기 점검 건수 (Pie Chart) */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>부산 구별 정기 점검 건수</Text>
                <PieChart
                  data={[
                    {
                      name: "남구",
                      population: 45,
                      color: "#8ABCAD",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "해운대구",
                      population: 30,
                      color: "#FFB74D",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "사하구",
                      population: 25,
                      color: "#FF5252",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "부산진구",
                      population: 40,
                      color: "#4CAF50",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "연제구",
                      population: 20,
                      color: "#29B6F6",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                  ]}
                  width={SCREEN_WIDTH - 40}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </>
          ) : (
            <>
              {/* ✅ 일정 추가 버튼 (신고 점검) */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate("Inspection/Schedule/EmptyPage")
                }
              >
                <Text style={styles.addButtonText}>+ 신고 점검 일정 추가</Text>
              </TouchableOpacity>

              {/* ✅ 부산 구별 신고 점검 건수 (Pie Chart) */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>부산 구별 신고 점검 건수</Text>
                <PieChart
                  data={[
                    {
                      name: "남구",
                      population: 10,
                      color: "#8ABCAD",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "해운대구",
                      population: 12,
                      color: "#FFB74D",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "사하구",
                      population: 8,
                      color: "#FF5252",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "부산진구",
                      population: 15,
                      color: "#4CAF50",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                    {
                      name: "연제구",
                      population: 5,
                      color: "#29B6F6",
                      legendFontColor: "#333",
                      legendFontSize: 14,
                    },
                  ]}
                  width={SCREEN_WIDTH - 40}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>

              {/* ✅ 점검 위치 */}
              {selectedTab === "신고 점검" && (
                <View style={styles.mapContainer}>
                  <Text style={styles.cardTitle}>점검 위치</Text>
                  <View style={styles.mapWrapper}>
                    {markers.length > 0 && <DashboardMap reports={markers} />}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* ✅ 노후 주택 TOP 5 */}
        <View style={[styles.card, { paddingBottom: 40 }]}>
          <Text style={styles.cardTitle}>부산 내 노후 주택 TOP 5</Text>
          <BarChart
            data={{
              labels: ["남구", "해운대구", "사하구", "부산진구", "연제구"],
              datasets: [{ data: [120, 90, 80, 70, 60] }],
            }}
            width={SCREEN_WIDTH - 60}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        </View>
      </ScrollView>

      {/* ✅ Footer 추가 */}
      <Footer />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(138, 188, 173, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const chartColors = [
  "#8ABCAD",
  "#FFB74D",
  "#FF5252",
  "#4CAF50",
  "#29B6F6",
  "#FF8A65",
  "#FFD54F",
  "#DCE775",
  "#81C784",
  "#64B5F6",
  "#9575CD",
  "#F06292",
  "#E57373",
  "#A1887F",
  "#90A4AE",
  "#B2FF59",
  "#FFD700",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe8d5",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  viewMyDashboardButton: { alignSelf: "flex-end", marginBottom: 10 },
  viewMyDashboardText: { fontSize: 14, fontWeight: "bold", color: "#5DAF8A" },

  /* ✅ 전환 바 스타일 */
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    borderRadius: 25,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    padding: 5,
    height: 50,
    overflow: "hidden",
  },
  switchButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  activeText: {
    color: "#fff",
  },
  switchIndicator: {
    position: "absolute",
    width: "50%",
    height: "130%",
    backgroundColor: "#8ABCAD",
    borderRadius: 25,
    top: 0,
  },

  /* ✅ 점검 진행 현황 */
  statusContainer: {
    marginBottom: 20,
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
  },
  statusTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  statusBox: { flexDirection: "row", justifyContent: "space-between" },
  statusItem: { fontSize: 14, fontWeight: "bold", color: "#333" },

  /* ✅ 일정 추가 버튼 */
  addButton: {
    backgroundColor: "#8ABCAD",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  /* ✅ 카드 스타일 */
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  chart: { borderRadius: 10 },

  viewReportsButton: {
    backgroundColor: "#8ABCAD", // 기존 디자인과 맞추는 색상
    padding: 10, // 기존 버튼 크기에 맞춰 패딩을 조금 줄였습니다.
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center", // 중앙 정렬을 위해
  },
  viewReportsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // 기존 버튼 텍스트 크기보다 약간 작게
  },
  pickerContainer: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: Platform.OS === "ios" ? 12 : 0,
  },

  mapContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  mapWrapper: {
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },

  roundedContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333",
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333",
    marginBottom: 10,
  },
};

export default DashboardScreen;
