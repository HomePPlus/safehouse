import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MyDashboardScreen = () => {
  const navigation = useNavigation();
  const [inspectionStatus, setInspectionStatus] = useState({
    예정됨: 0,
    진행중: 0,
    완료됨: 0,
    취소됨: 0,
  });
  const [todayInspections, setTodayInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInspectionStatistics = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/statistics/inspector",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("점검 진행 현황 응답:", response.data);

      if (response.status === 200) {
        const data = response.data.data;
        setInspectionStatus({
          예정됨: data["예정됨"] || 0,
          진행중: data["진행중"] || 0,
          완료됨: data["완료됨"] || 0,
          취소됨: data["취소됨"] || 0,
        });
      }
    } catch (error) {
      console.error(
        "🚨 점검 진행 현황 데이터 불러오기 오류:",
        error.response?.data || error.message
      );
    }
  };

  const fetchTodayInspections = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspections/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("오늘 점검 예약 데이터:", response.data);
        setTodayInspections(response.data.data);
      } else {
        console.error("🚨 오늘 점검 예약 데이터 불러오기 오류:", response.data);
        alert(
          "오늘 점검 예약 데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해 주세요."
        );
      }
    } catch (error) {
      console.error("🚨 오늘 점검 예약 데이터 불러오기 오류:", error.message);
      alert("서버와의 연결에 문제가 발생했습니다. 나중에 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectionStatistics();
    fetchTodayInspections();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>내 점검 현황</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* 정기 점검 보수 현황 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>나의 점검 보수 현황</Text>
          <View style={styles.statusBox}>
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

        {/* 내 구역 예약 현황 */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>내 구역 예약 현황</Text>
          <View style={styles.reservationBox}>
            <Text style={styles.reservationItem}>📅 예정된 점검: 3건</Text>
            <Text style={styles.reservationItem}>🔍 점검 대기: 2건</Text>
          </View>
        </View> */}

        {/* 내 구역의 결함 종류 통계 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>내 구역 결함 종류</Text>
          <PieChart
            data={[
              {
                name: "균열",
                population: 12,
                color: "#FF5252",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "누수",
                population: 8,
                color: "#FFB74D",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "기타",
                population: 5,
                color: "#4CAF50",
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

        {/* 오늘 점검 예약 리스트 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘 점검 예약 리스트</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#8ABCAD" />
          ) : (
            todayInspections.map((item) => {
              const prefix = item.type === "정기" ? "Re_" : "Rp_";
              const inspectionId = `${prefix}${item.inspection_id}`;

              return (
                <View key={item.inspection_id} style={styles.inspectionItem}>
                  <View style={styles.inspectionHeader}>
                    <Text style={styles.inspectionId}>{inspectionId}</Text>
                    <Text style={styles.inspectorName}>
                      {item.inspector_name}
                    </Text>
                  </View>
                  <Text style={styles.inspectionStatus}>
                    상태: {item.status}
                  </Text>
                  <Text style={styles.inspectionDate}>
                    예약일: {item.schedule_date}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe8d5",
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  /* 헤더 */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

  /* 카드 스타일 */
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },

  /* 점검 현황 */
  statusBox: { flexDirection: "row", justifyContent: "space-between" },
  statusItem: { fontSize: 14, fontWeight: "bold", color: "#333" },

  /* 예약 현황 */
  reservationBox: { flexDirection: "row", justifyContent: "space-between" },
  reservationItem: { fontSize: 14, fontWeight: "bold", color: "#555" },

  inspectionItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  inspectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inspectionId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  inspectorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8ABCAD",
  },
  inspectionStatus: {
    fontSize: 14,
    color: "#FF5252",
  },
  inspectionDate: {
    fontSize: 14,
    color: "#555",
  },
});

export default MyDashboardScreen;
