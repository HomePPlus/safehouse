import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/molecules/Header/Header";

const ChecklistFormViewer = () => {
  const route = useRoute();
  const formData = route.params?.formData;

  const [expandedSections, setExpandedSections] = useState({});

  if (!formData) {
    return (
      <View style={styles.container}>
        <Header
          title="체크리스트 상세"
          logoSource={require("../../../assets/images/logo.png")}
          backButtonSource={require("../../../assets/images/back-arrow.png")}
        />
        <Text style={styles.errorText}>
          체크리스트 데이터를 불러올 수 없습니다.
        </Text>
      </View>
    );
  }

  // ✅ 카테고리별로 데이터 그룹화
  const groupedData = {
    "기본 정보": {
      "점검 ID": formData.inspection_id,
      "점검 일자": formData.inspection_date,
      "점검자 이름": formData.inspector_name,
      "점검자 연락처": formData.inspector_contact,
      주소: formData.address,
    },
    "결함 정보": {
      "결함 유형": formData.defect_type?.join(", ") || "데이터 없음", // ✅ 추가
      "콘크리트 균열": {
        "균열 타입": formData.concrete_crack_type,
        "균열 길이 (cm)": formData.concrete_crack_length_cm,
        "균열 폭 (mm)": formData.concrete_crack_width_mm,
        "균열 깊이 (mm)": formData.concrete_crack_depth_mm,
        "누수 여부": formData.concrete_crack_leakage,
        "이동 여부": formData.concrete_crack_movement,
        "변화 여부": formData.concrete_crack_change,
        "응급 조치": formData.concrete_crack_emergency_action,
        "수리 계획": formData.concrete_crack_repair_plan,
      },
      "누수/백태": {
        "누수 범위": formData.leak_eflo_leakage_range,
        "누수 원인": formData.leak_eflo_leakage_cause,
        "백태 여부": formData.leak_eflo_eflorescence,
        "응급 조치": formData.leak_eflo_emergency_action,
        "수리 계획": formData.leak_eflo_repair_plan,
      },
      "강재 손상": {
        "손상 범위": formData.steel_damage_range,
        "손상 정도": formData.steel_damage_severity,
        "손상 원인": formData.steel_damage_cause,
        "응급 조치": formData.steel_damage_emergency_action,
        "수리 계획": formData.steel_damage_repair_plan,
      },
      박리: {
        "박리 범위": formData.delamination_range,
        "박리 원인": formData.delamination_cause,
        "응급 조치": formData.delamination_emergency_action,
        "수리 계획": formData.delamination_repair_plan,
      },
      "철근 노출": {
        "노출 범위": formData.rebar_exposure_range,
        "노출 상태": formData.rebar_exposure_condition,
        "노출 원인": formData.rebar_exposure_cause,
        "응급 조치": formData.rebar_exposure_emergency_action,
        "수리 계획": formData.rebar_exposure_repair_plan,
      },
      "도장 손상": {
        "손상 범위": formData.paint_damage_range,
        "손상 원인": formData.paint_damage_cause,
        "손상 상태": formData.paint_damage_condition,
        "응급 조치": formData.paint_damage_emergency_action,
        "수리 계획": formData.paint_damage_repair_plan,
      },
    },
    "평가 정보": {
      "전체 점검 결과": formData.overall_result,
      "모니터링 필요 여부": formData.monitoring_required,
      "다음 점검 일정": formData.next_inspection_date,
    },
  };

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="체크리스트 상세"
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />
      <ScrollView style={styles.container}>
        {Object.entries(groupedData).map(([category, data]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>

            {category === "결함 정보" ? (
              <>
                <View style={styles.defectTypeBox}>
                  <Text style={styles.defectTypeLabel}>결함 유형</Text>
                  <Text style={styles.defectTypeValue}>
                    {data["결함 유형"]}
                  </Text>
                </View>

                {Object.entries(data)
                  .filter(([key]) => key !== "결함 유형")
                  .map(([defect, details]) => (
                    <View key={defect}>
                      <TouchableOpacity
                        onPress={() => toggleSection(defect)}
                        style={styles.toggleHeader}
                      >
                        <Text style={styles.defectTitle}>{defect}</Text>
                        <Text style={styles.toggleIcon}>
                          {expandedSections[defect] ? "▲" : "▼"}
                        </Text>
                      </TouchableOpacity>
                      <Collapsible collapsed={!expandedSections[defect]}>
                        <View style={styles.detailsContainer}>
                          {Object.entries(details).map(([key, value]) => (
                            <View key={key} style={styles.row}>
                              <Text style={styles.label}>{key}</Text>
                              <Text style={styles.value}>
                                {value || "데이터 없음"}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </Collapsible>
                    </View>
                  ))}
              </>
            ) : (
              <View style={styles.table}>
                {Object.entries(data).map(([key, value]) => (
                  <View key={key} style={styles.row}>
                    <Text style={styles.label}>{key}</Text>
                    <Text style={styles.value}>{value || "데이터 없음"}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FB" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E8BFF",
    marginBottom: 10,
  },
  defectTypeBox: {
    backgroundColor: "#E0F2FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  defectTypeLabel: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  defectTypeValue: { fontSize: 16, color: "#333" },
  toggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  defectTitle: { fontSize: 18, fontWeight: "bold" },
  toggleIcon: { fontSize: 18 },
  detailsContainer: { paddingVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  value: { fontSize: 16, color: "#333" },
});

export default ChecklistFormViewer;
