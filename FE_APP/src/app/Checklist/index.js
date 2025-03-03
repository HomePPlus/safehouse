import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { TabView, TabBar } from "react-native-tab-view";

// 이 부분은 프로젝트 환경에 맞춰 경로 수정
import Header from "../../components/molecules/Header/Header";
import { submitChecklist } from "../../api/checklistApi";

/** ===============================
 *  1) 기초 정보 입력 탭 컴포넌트
 * =============================== */
const BasicInfoTab = ({ basicInfo, setBasicInfo }) => {
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.detailSection}>
        <Text style={styles.title}>기본 정보 입력</Text>

        <TextInput
          style={styles.input}
          placeholder="점검 번호"
          value={basicInfo.inspectionNumber}
          onChangeText={(text) =>
            setBasicInfo({ ...basicInfo, inspectionNumber: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="점검 일자 (YYYY-MM-DD)"
          value={basicInfo.inspectionDate}
          onChangeText={(text) =>
            setBasicInfo({ ...basicInfo, inspectionDate: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="점검자 이름"
          value={basicInfo.inspectorName}
          onChangeText={(text) =>
            setBasicInfo({ ...basicInfo, inspectorName: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="점검자 연락처"
          keyboardType="phone-pad"
          value={basicInfo.inspectorContact}
          onChangeText={(text) =>
            setBasicInfo({ ...basicInfo, inspectorContact: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="주소"
          value={basicInfo.address}
          onChangeText={(text) => setBasicInfo({ ...basicInfo, address: text })}
        />
      </View>
    </ScrollView>
  );
};

/** ===================================
 *  2) 결함 선택 및 상세 입력 탭 컴포넌트
 * =================================== */
const DefectTab = ({
  defectTypes,
  setDefectTypes,
  concreteCrack,
  setConcreteCrack,
  waterLeak,
  setWaterLeak,
  steelDamage,
  setSteelDamage,
  spalling,
  setSpalling,
  rebarExposure,
  setRebarExposure,
  paintDamage,
  setPaintDamage,
}) => {
  /**
   * 📌 결함별 상세 UI를 렌더링하는 함수
   *    (강재 손상, 박리, 철근 노출, 도장 손상 등 질문에서 주신 모든 내용을 완전히 포함)
   */
  const renderDefectDetails = () => {
    return (
      <>
        {/* ====================================== */}
        {/* 1) 콘크리트 균열 */}
        {/* ====================================== */}
        {defectTypes.concreteCrack && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>콘크리트 균열 상세</Text>

            {/* 균열의 형태 */}
            <Text style={styles.label}>균열의 형태:</Text>
            <Picker
              selectedValue={concreteCrack.type}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setConcreteCrack({ ...concreteCrack, type: itemValue })
              }
            >
              <Picker.Item label="수평" value="수평" />
              <Picker.Item label="수직" value="수직" />
              <Picker.Item label="경사" value="경사" />
              <Picker.Item label="대각선" value="대각선" />
            </Picker>

            {/* 균열의 길이 */}
            <Text style={styles.label}>균열의 길이:</Text>
            <View style={styles.measurementContainer}>
              <TextInput
                style={styles.measurementInput}
                value={concreteCrack.length}
                onChangeText={(text) =>
                  setConcreteCrack({ ...concreteCrack, length: text })
                }
                keyboardType="numeric"
                placeholder="길이 입력"
              />
              <Text style={styles.unitText}>cm</Text>
            </View>

            {/* 균열의 폭 */}
            <Text style={styles.label}>균열의 폭:</Text>
            <View style={styles.measurementContainer}>
              <TextInput
                style={styles.measurementInput}
                value={concreteCrack.width}
                onChangeText={(text) =>
                  setConcreteCrack({ ...concreteCrack, width: text })
                }
                keyboardType="numeric"
                placeholder="폭 입력"
              />
              <Text style={styles.unitText}>mm</Text>
            </View>

            {/* 균열의 깊이 */}
            <Text style={styles.label}>균열의 깊이:</Text>
            <View style={styles.measurementContainer}>
              <TextInput
                style={styles.measurementInput}
                value={concreteCrack.depth}
                onChangeText={(text) =>
                  setConcreteCrack({ ...concreteCrack, depth: text })
                }
                keyboardType="numeric"
                placeholder="깊이 입력"
              />
              <Text style={styles.unitText}>mm</Text>
            </View>

            {/* 누수 여부 */}
            <Text style={styles.label}>누수 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={concreteCrack.leakage === "예"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    leakage: newValue ? "예" : "",
                  })
                }
                color={concreteCrack.leakage === "예" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>예</Text>
              <Checkbox
                value={concreteCrack.leakage === "아니오"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    leakage: newValue ? "아니오" : "",
                  })
                }
                color={
                  concreteCrack.leakage === "아니오" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>아니오</Text>
            </View>

            {/* 균열의 이동성 */}
            <Text style={styles.label}>균열의 이동성:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={concreteCrack.movement === "이동 중"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    movement: newValue ? "이동 중" : "",
                  })
                }
                color={
                  concreteCrack.movement === "이동 중" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>이동 중</Text>
              <Checkbox
                value={concreteCrack.movement === "고정됨"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    movement: newValue ? "고정됨" : "",
                  })
                }
                color={
                  concreteCrack.movement === "고정됨" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>고정됨</Text>
            </View>

            {/* 균열의 변화 여부 */}
            <Text style={styles.label}>균열의 변화 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={concreteCrack.change === "확대 됨"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    change: newValue ? "확대 됨" : "",
                  })
                }
                color={
                  concreteCrack.change === "확대 됨" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>확대 됨</Text>
              <Checkbox
                value={concreteCrack.change === "변화 없음"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    change: newValue ? "변화 없음" : "",
                  })
                }
                color={
                  concreteCrack.change === "변화 없음" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>변화 없음</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={concreteCrack.emergency === "필요"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={
                  concreteCrack.emergency === "필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={concreteCrack.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setConcreteCrack({
                    ...concreteCrack,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={
                  concreteCrack.emergency === "불필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={concreteCrack.emergencyAction}
              onChangeText={(text) =>
                setConcreteCrack({
                  ...concreteCrack,
                  emergencyAction: text,
                })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />
          </View>
        )}

        {/* ====================================== */}
        {/* 2) 누수 / 백태 */}
        {/* ====================================== */}
        {defectTypes.waterLeak && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>누수/백태 상세</Text>
            {/* 누수 발생 범위 */}
            <Text style={styles.label}>누수 발생 범위:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.leakageRange === "소규모"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageRange: newValue ? "소규모" : "",
                  })
                }
                color={
                  waterLeak.leakageRange === "소규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>소규모</Text>
              <Checkbox
                value={waterLeak.leakageRange === "중규모"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageRange: newValue ? "중규모" : "",
                  })
                }
                color={
                  waterLeak.leakageRange === "중규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>중규모</Text>
              <Checkbox
                value={waterLeak.leakageRange === "대규모"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageRange: newValue ? "대규모" : "",
                  })
                }
                color={
                  waterLeak.leakageRange === "대규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>대규모</Text>
            </View>

            {/* 누수의 원인 */}
            <Text style={styles.label}>누수의 원인:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.leakageCause === "기온 변화"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageCause: newValue ? "기온 변화" : "",
                  })
                }
                color={
                  waterLeak.leakageCause === "기온 변화" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>기온 변화</Text>
              <Checkbox
                value={waterLeak.leakageCause === "습도 변화"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageCause: newValue ? "습도 변화" : "",
                  })
                }
                color={
                  waterLeak.leakageCause === "습도 변화" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>습도 변화</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.leakageCause === "시공 결함"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageCause: newValue ? "시공 결함" : "",
                  })
                }
                color={
                  waterLeak.leakageCause === "시공 결함" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>시공 결함</Text>
              <Checkbox
                value={waterLeak.leakageCause === "재료적 원인"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageCause: newValue ? "재료적 원인" : "",
                  })
                }
                color={
                  waterLeak.leakageCause === "재료적 원인"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>재료적 원인</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.leakageCause === "배수 및 통풍 문제"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    leakageCause: newValue ? "배수 및 통풍 문제" : "",
                  })
                }
                color={
                  waterLeak.leakageCause === "배수 및 통풍 문제"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>배수 및 통풍 문제</Text>
            </View>

            {/* 백태 발생 여부 */}
            <Text style={styles.label}>백태 발생 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.eflorescence === "예"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    eflorescence: newValue ? "예" : "",
                  })
                }
                color={waterLeak.eflorescence === "예" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>예</Text>
              <Checkbox
                value={waterLeak.eflorescence === "아니오"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    eflorescence: newValue ? "아니오" : "",
                  })
                }
                color={
                  waterLeak.eflorescence === "아니오" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>아니오</Text>
            </View>

            {/* 누수 및 백태의 영향 */}
            <Text style={styles.label}>누수 및 백태의 영향:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.impact === "구조적 손상 없음"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    impact: newValue ? "구조적 손상 없음" : "",
                  })
                }
                color={
                  waterLeak.impact === "구조적 손상 없음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 손상 없음</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.impact === "구조적 손상 가능"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    impact: newValue ? "구조적 손상 가능" : "",
                  })
                }
                color={
                  waterLeak.impact === "구조적 손상 가능"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 손상 가능</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.emergency === "필요"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={waterLeak.emergency === "필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={waterLeak.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={waterLeak.emergency === "불필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={waterLeak.emergencyAction}
              onChangeText={(text) =>
                setWaterLeak({ ...waterLeak, emergencyAction: text })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />

            {/* 수리 계획 */}
            <Text style={styles.label}>수리 계획:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.repairPlan === "방수처리"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    repairPlan: newValue ? "방수처리" : "",
                  })
                }
                color={
                  waterLeak.repairPlan === "방수처리" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>방수처리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.repairPlan === "배수 시스템 점검"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    repairPlan: newValue ? "배수 시스템 점검" : "",
                  })
                }
                color={
                  waterLeak.repairPlan === "배수 시스템 점검"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>배수 시스템 점검</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.repairPlan === "균열 보수"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    repairPlan: newValue ? "균열 보수" : "",
                  })
                }
                color={
                  waterLeak.repairPlan === "균열 보수" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>균열 보수</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={waterLeak.repairPlan === "표면 복원 작업"}
                onValueChange={(newValue) =>
                  setWaterLeak({
                    ...waterLeak,
                    repairPlan: newValue ? "표면 복원 작업" : "",
                  })
                }
                color={
                  waterLeak.repairPlan === "표면 복원 작업"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>표면 복원 작업</Text>
            </View>
          </View>
        )}

        {/* ====================================== */}
        {/* 3) 강재 손상 */}
        {/* ====================================== */}
        {defectTypes.steelDamage && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>강재 손상 상세</Text>

            {/* 손상 범위 */}
            <Text style={styles.label}>손상 범위:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageRange === "소규모"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageRange: newValue ? "소규모" : "",
                  })
                }
                color={
                  steelDamage.damageRange === "소규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>소규모</Text>
              <Checkbox
                value={steelDamage.damageRange === "중규모"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageRange: newValue ? "중규모" : "",
                  })
                }
                color={
                  steelDamage.damageRange === "중규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>중규모</Text>
              <Checkbox
                value={steelDamage.damageRange === "대규모"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageRange: newValue ? "대규모" : "",
                  })
                }
                color={
                  steelDamage.damageRange === "대규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>대규모</Text>
            </View>

            {/* 손상 정도 */}
            <Text style={styles.label}>손상 정도:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageSeverity === "부식"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageSeverity: newValue ? "부식" : "",
                  })
                }
                color={
                  steelDamage.damageSeverity === "부식" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>부식</Text>
              <Checkbox
                value={steelDamage.damageSeverity === "찌그러짐"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageSeverity: newValue ? "찌그러짐" : "",
                  })
                }
                color={
                  steelDamage.damageSeverity === "찌그러짐"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>찌그러짐</Text>
              <Checkbox
                value={steelDamage.damageSeverity === "파손"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageSeverity: newValue ? "파손" : "",
                  })
                }
                color={
                  steelDamage.damageSeverity === "파손" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>파손</Text>
            </View>

            {/* 손상의 원인 */}
            <Text style={styles.label}>손상의 원인:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageCause === "시공 및 제작 결함"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageCause: newValue ? "시공 및 제작 결함" : "",
                  })
                }
                color={
                  steelDamage.damageCause === "시공 및 제작 결함"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>시공 및 제작 결함</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageCause === "피로 및 반복 하중"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageCause: newValue ? "피로 및 반복 하중" : "",
                  })
                }
                color={
                  steelDamage.damageCause === "피로 및 반복 하중"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>피로 및 반복 하중</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageCause === "열적 영향 및 온도 변화"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageCause: newValue ? "열적 영향 및 온도 변화" : "",
                  })
                }
                color={
                  steelDamage.damageCause === "열적 영향 및 온도 변화"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>열적 영향 및 온도 변화</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageCause === "구조적 문제"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageCause: newValue ? "구조적 문제" : "",
                  })
                }
                color={
                  steelDamage.damageCause === "구조적 문제"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 문제</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.damageCause === "충격 및 외부 요인"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    damageCause: newValue ? "충격 및 외부 요인" : "",
                  })
                }
                color={
                  steelDamage.damageCause === "충격 및 외부 요인"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>충격 및 외부 요인</Text>
            </View>

            {/* 구조적 안전성에 미치는 영향 */}
            <Text style={styles.label}>구조적 안전성에 미치는 영향:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.stabilityImpact === "안전성에 영향 없음"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    stabilityImpact: newValue ? "안전성에 영향 없음" : "",
                  })
                }
                color={
                  steelDamage.stabilityImpact === "안전성에 영향 없음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 없음</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.stabilityImpact === "안전성에 영향 있음"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    stabilityImpact: newValue ? "안전성에 영향 있음" : "",
                  })
                }
                color={
                  steelDamage.stabilityImpact === "안전성에 영향 있음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 있음</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.emergency === "필요"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={steelDamage.emergency === "필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={steelDamage.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={
                  steelDamage.emergency === "불필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={steelDamage.emergencyAction}
              onChangeText={(text) =>
                setSteelDamage({ ...steelDamage, emergencyAction: text })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />

            {/* 수리 계획 */}
            <Text style={styles.label}>수리 계획:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.repairPlan === "균열부 재용접"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    repairPlan: newValue ? "균열부 재용접" : "",
                  })
                }
                color={
                  steelDamage.repairPlan === "균열부 재용접"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>균열부 재용접</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.repairPlan === "강재 교체"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    repairPlan: newValue ? "강재 교체" : "",
                  })
                }
                color={
                  steelDamage.repairPlan === "강재 교체" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>강재 교체</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.repairPlan === "기계적 교정"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    repairPlan: newValue ? "기계적 교정" : "",
                  })
                }
                color={
                  steelDamage.repairPlan === "기계적 교정"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>기계적 교정</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.repairPlan === "열처리 및 인성 회복"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    repairPlan: newValue ? "열처리 및 인성 회복" : "",
                  })
                }
                color={
                  steelDamage.repairPlan === "열처리 및 인성 회복"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>열처리 및 인성 회복</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={steelDamage.repairPlan === "보강, 패치 플레이트 부착"}
                onValueChange={(newValue) =>
                  setSteelDamage({
                    ...steelDamage,
                    repairPlan: newValue ? "보강, 패치 플레이트 부착" : "",
                  })
                }
                color={
                  steelDamage.repairPlan === "보강, 패치 플레이트 부착"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>보강, 패치 플레이트 부착</Text>
            </View>
          </View>
        )}

        {/* ====================================== */}
        {/* 4) 박리 (Spalling) */}
        {/* ====================================== */}
        {defectTypes.spalling && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>박리 상세</Text>

            {/* 박리 범위 */}
            <Text style={styles.label}>박리 범위:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.range === "소규모"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    range: newValue ? "소규모" : "",
                  })
                }
                color={spalling.range === "소규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>소규모</Text>
              <Checkbox
                value={spalling.range === "중규모"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    range: newValue ? "중규모" : "",
                  })
                }
                color={spalling.range === "중규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>중규모</Text>
              <Checkbox
                value={spalling.range === "대규모"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    range: newValue ? "대규모" : "",
                  })
                }
                color={spalling.range === "대규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>대규모</Text>
            </View>

            {/* 박리의 원인 */}
            <Text style={styles.label}>박리의 원인:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.cause === "내부 압력 증가"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    cause: newValue ? "내부 압력 증가" : "",
                  })
                }
                color={
                  spalling.cause === "내부 압력 증가" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>내부 압력 증가</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.cause === "시공 불량"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    cause: newValue ? "시공 불량" : "",
                  })
                }
                color={spalling.cause === "시공 불량" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>시공 불량</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.cause === "외부 환경 요인"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    cause: newValue ? "외부 환경 요인" : "",
                  })
                }
                color={
                  spalling.cause === "외부 환경 요인" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>외부 환경 요인</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.cause === "구조적 문제"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    cause: newValue ? "구조적 문제" : "",
                  })
                }
                color={spalling.cause === "구조적 문제" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>구조적 문제</Text>
            </View>

            {/* 구조적 안전성에 미치는 영향 */}
            <Text style={styles.label}>구조적 안전성에 미치는 영향:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.stabilityImpact === "안전성에 영향 없음"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    stabilityImpact: newValue ? "안전성에 영향 없음" : "",
                  })
                }
                color={
                  spalling.stabilityImpact === "안전성에 영향 없음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 없음</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.stabilityImpact === "안전성에 영향 있음"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    stabilityImpact: newValue ? "안전성에 영향 있음" : "",
                  })
                }
                color={
                  spalling.stabilityImpact === "안전성에 영향 있음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 있음</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.emergency === "필요"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={spalling.emergency === "필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={spalling.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={spalling.emergency === "불필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={spalling.emergencyAction}
              onChangeText={(text) =>
                setSpalling({ ...spalling, emergencyAction: text })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />

            {/* 수리 계획 */}
            <Text style={styles.label}>수리 계획:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.repairPlan === "표면 보수"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    repairPlan: newValue ? "표면 보수" : "",
                  })
                }
                color={
                  spalling.repairPlan === "표면 보수" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>표면 보수</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.repairPlan === "패칭 보수"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    repairPlan: newValue ? "패칭 보수" : "",
                  })
                }
                color={
                  spalling.repairPlan === "패칭 보수" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>패칭 보수</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.repairPlan === "철근 보강 후 보수"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    repairPlan: newValue ? "철근 보강 후 보수" : "",
                  })
                }
                color={
                  spalling.repairPlan === "철근 보강 후 보수"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>철근 보강 후 보수</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={spalling.repairPlan === "구조적 보강 및 보수"}
                onValueChange={(newValue) =>
                  setSpalling({
                    ...spalling,
                    repairPlan: newValue ? "구조적 보강 및 보수" : "",
                  })
                }
                color={
                  spalling.repairPlan === "구조적 보강 및 보수"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 보강 및 보수</Text>
            </View>
          </View>
        )}

        {/* ====================================== */}
        {/* 5) 철근 노출 */}
        {/* ====================================== */}
        {defectTypes.rebarExposure && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>철근 노출 상세</Text>

            {/* 노출 범위 */}
            <Text style={styles.label}>노출 범위:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.range === "소규모"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    range: newValue ? "소규모" : "",
                  })
                }
                color={rebarExposure.range === "소규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>소규모</Text>
              <Checkbox
                value={rebarExposure.range === "중규모"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    range: newValue ? "중규모" : "",
                  })
                }
                color={rebarExposure.range === "중규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>중규모</Text>
              <Checkbox
                value={rebarExposure.range === "대규모"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    range: newValue ? "대규모" : "",
                  })
                }
                color={rebarExposure.range === "대규모" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>대규모</Text>
            </View>

            {/* 노출된 철근 상태 */}
            <Text style={styles.label}>노출된 철근 상태:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.condition === "부식 없음"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    condition: newValue ? "부식 없음" : "",
                  })
                }
                color={
                  rebarExposure.condition === "부식 없음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>부식 없음</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.condition === "경미한 부식"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    condition: newValue ? "경미한 부식" : "",
                  })
                }
                color={
                  rebarExposure.condition === "경미한 부식"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>경미한 부식</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.condition === "심각한 부식"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    condition: newValue ? "심각한 부식" : "",
                  })
                }
                color={
                  rebarExposure.condition === "심각한 부식"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>심각한 부식</Text>
            </View>

            {/* 노출의 원인 */}
            <Text style={styles.label}>노출의 원인:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.cause === "시공 불량"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    cause: newValue ? "시공 불량" : "",
                  })
                }
                color={
                  rebarExposure.cause === "시공 불량" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>시공 불량</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.cause === "재료적 문제"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    cause: newValue ? "재료적 문제" : "",
                  })
                }
                color={
                  rebarExposure.cause === "재료적 문제" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>재료적 문제</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.cause === "환경 요인"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    cause: newValue ? "환경 요인" : "",
                  })
                }
                color={
                  rebarExposure.cause === "환경 요인" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>환경 요인</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.cause === "구조적 문제"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    cause: newValue ? "구조적 문제" : "",
                  })
                }
                color={
                  rebarExposure.cause === "구조적 문제" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 문제</Text>
            </View>

            {/* 구조적 안전성에 미치는 영향 */}
            <Text style={styles.label}>구조적 안전성에 미치는 영향:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.stabilityImpact === "안전성에 영향 없음"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    stabilityImpact: newValue ? "안전성에 영향 없음" : "",
                  })
                }
                color={
                  rebarExposure.stabilityImpact === "안전성에 영향 없음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 없음</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.stabilityImpact === "안전성에 영향 있음"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    stabilityImpact: newValue ? "안전성에 영향 있음" : "",
                  })
                }
                color={
                  rebarExposure.stabilityImpact === "안전성에 영향 있음"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>안전성에 영향 있음</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.emergency === "필요"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={
                  rebarExposure.emergency === "필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={rebarExposure.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={
                  rebarExposure.emergency === "불필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={rebarExposure.emergencyAction}
              onChangeText={(text) =>
                setRebarExposure({
                  ...rebarExposure,
                  emergencyAction: text,
                })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />

            {/* 수리 계획 */}
            <Text style={styles.label}>수리 계획:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.repairPlan === "철근 교체 및 추가 보강"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    repairPlan: newValue ? "철근 교체 및 추가 보강" : "",
                  })
                }
                color={
                  rebarExposure.repairPlan === "철근 교체 및 추가 보강"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>철근 교체 및 추가 보강</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.repairPlan === "방청 처리"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    repairPlan: newValue ? "방청 처리" : "",
                  })
                }
                color={
                  rebarExposure.repairPlan === "방청 처리"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>방청 처리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.repairPlan === "보수 모르타르 충전"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    repairPlan: newValue ? "보수 모르타르 충전" : "",
                  })
                }
                color={
                  rebarExposure.repairPlan === "보수 모르타르 충전"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>보수 모르타르 충전</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={rebarExposure.repairPlan === "표면 마감"}
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    repairPlan: newValue ? "표면 마감" : "",
                  })
                }
                color={
                  rebarExposure.repairPlan === "표면 마감"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>표면 마감</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={
                  rebarExposure.repairPlan === "FRP 보강재 및 강판 보강 적용"
                }
                onValueChange={(newValue) =>
                  setRebarExposure({
                    ...rebarExposure,
                    repairPlan: newValue ? "FRP 보강재 및 강판 보강 적용" : "",
                  })
                }
                color={
                  rebarExposure.repairPlan === "FRP 보강재 및 강판 보강 적용"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>
                FRP 보강재 및 강판 보강 적용
              </Text>
            </View>
          </View>
        )}

        {/* ====================================== */}
        {/* 6) 도장 손상 */}
        {/* ====================================== */}
        {defectTypes.paintDamage && (
          <View style={styles.detailSection}>
            <Text style={styles.subTitle}>도장 손상 상세</Text>

            {/* 손상 범위 */}
            <Text style={styles.label}>손상 범위:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageRange === "소규모"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageRange: newValue ? "소규모" : "",
                  })
                }
                color={
                  paintDamage.damageRange === "소규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>소규모</Text>
              <Checkbox
                value={paintDamage.damageRange === "중규모"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageRange: newValue ? "중규모" : "",
                  })
                }
                color={
                  paintDamage.damageRange === "중규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>중규모</Text>
              <Checkbox
                value={paintDamage.damageRange === "대규모"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageRange: newValue ? "대규모" : "",
                  })
                }
                color={
                  paintDamage.damageRange === "대규모" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>대규모</Text>
            </View>

            {/* 손상의 원인 */}
            <Text style={styles.label}>손상의 원인:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageCause === "재료적 원인"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageCause: newValue ? "재료적 원인" : "",
                  })
                }
                color={
                  paintDamage.damageCause === "재료적 원인"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>재료적 원인</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageCause === "시공 불량"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageCause: newValue ? "시공 불량" : "",
                  })
                }
                color={
                  paintDamage.damageCause === "시공 불량"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>시공 불량</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageCause === "환경적 원인"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageCause: newValue ? "환경적 원인" : "",
                  })
                }
                color={
                  paintDamage.damageCause === "환경적 원인"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>환경적 원인</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageCause === "구조적 요인"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageCause: newValue ? "구조적 요인" : "",
                  })
                }
                color={
                  paintDamage.damageCause === "구조적 요인"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>구조적 요인</Text>
            </View>

            {/* 손상의 상태 */}
            <Text style={styles.label}>손상의 상태:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageSeverity === "표면 손상"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageSeverity: newValue ? "표면 손상" : "",
                  })
                }
                color={
                  paintDamage.damageSeverity === "표면 손상"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>표면 손상</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.damageSeverity === "깊은 손상"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    damageSeverity: newValue ? "깊은 손상" : "",
                  })
                }
                color={
                  paintDamage.damageSeverity === "깊은 손상"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>깊은 손상</Text>
            </View>

            {/* 응급처치 필요 여부 */}
            <Text style={styles.label}>응급처치 필요 여부:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.emergency === "필요"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    emergency: newValue ? "필요" : "",
                  })
                }
                color={paintDamage.emergency === "필요" ? "#4CAF50" : undefined}
              />
              <Text style={styles.radioLabel}>필요</Text>
              <Checkbox
                value={paintDamage.emergency === "불필요"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    emergency: newValue ? "불필요" : "",
                  })
                }
                color={
                  paintDamage.emergency === "불필요" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>불필요</Text>
            </View>

            {/* 응급 조치 사항 */}
            <Text style={styles.label}>응급 조치 사항:</Text>
            <TextInput
              style={styles.textArea}
              value={paintDamage.emergencyAction}
              onChangeText={(text) =>
                setPaintDamage({ ...paintDamage, emergencyAction: text })
              }
              multiline
              numberOfLines={3}
              placeholder="응급 조치 사항을 입력하세요"
            />

            {/* 수리 계획 */}
            <Text style={styles.label}>수리 계획:</Text>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.repairPlan === "균열 수리"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    repairPlan: newValue ? "균열 수리" : "",
                  })
                }
                color={
                  paintDamage.repairPlan === "균열 수리" ? "#4CAF50" : undefined
                }
              />
              <Text style={styles.radioLabel}>균열 수리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.repairPlan === "박리 및 들뜸 수리"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    repairPlan: newValue ? "박리 및 들뜸 수리" : "",
                  })
                }
                color={
                  paintDamage.repairPlan === "박리 및 들뜸 수리"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>박리 및 들뜸 수리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.repairPlan === "기포 및 블리스터 수리"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    repairPlan: newValue ? "기포 및 블리스터 수리" : "",
                  })
                }
                color={
                  paintDamage.repairPlan === "기포 및 블리스터 수리"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>기포 및 블리스터 수리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.repairPlan === "분말화 수리"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    repairPlan: newValue ? "분말화 수리" : "",
                  })
                }
                color={
                  paintDamage.repairPlan === "분말화 수리"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>분말화 수리</Text>
            </View>
            <View style={styles.radioContainer}>
              <Checkbox
                value={paintDamage.repairPlan === "변색 및 오염 수리"}
                onValueChange={(newValue) =>
                  setPaintDamage({
                    ...paintDamage,
                    repairPlan: newValue ? "변색 및 오염 수리" : "",
                  })
                }
                color={
                  paintDamage.repairPlan === "변색 및 오염 수리"
                    ? "#4CAF50"
                    : undefined
                }
              />
              <Text style={styles.radioLabel}>변색 및 오염 수리</Text>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.detailSection}>
        <Text style={styles.title}>결함 유형 선택</Text>

        {/* 체크박스: 결함 유형들 */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.concreteCrack}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, concreteCrack: newValue })
            }
            color={defectTypes.concreteCrack ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>콘크리트 균열</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.waterLeak}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, waterLeak: newValue })
            }
            color={defectTypes.waterLeak ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>누수/백태</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.steelDamage}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, steelDamage: newValue })
            }
            color={defectTypes.steelDamage ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>강재 손상</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.spalling}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, spalling: newValue })
            }
            color={defectTypes.spalling ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>박리</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.rebarExposure}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, rebarExposure: newValue })
            }
            color={defectTypes.rebarExposure ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>철근 노출</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={defectTypes.paintDamage}
            onValueChange={(newValue) =>
              setDefectTypes({ ...defectTypes, paintDamage: newValue })
            }
            color={defectTypes.paintDamage ? "#4CAF50" : undefined}
          />
          <Text style={styles.checkboxLabel}>도장 손상</Text>
        </View>

        {/* 선택된 결함 유형에 따른 세부 내용 */}
        {renderDefectDetails()}
      </View>
    </ScrollView>
  );
};

/** ============================
 *  3) 종합 평가 탭 컴포넌트
 * ============================ */
const EvaluationTab = ({
  overallEvaluation,
  setOverallEvaluation,
  handleSubmit,
}) => {
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.detailSection}>
        <Text style={styles.title}>종합 평가</Text>

        {/* 전체 점검 결과 */}
        <Text style={styles.label}>전체 점검 결과:</Text>
        <View style={styles.radioContainer}>
          <Checkbox
            value={overallEvaluation.overallResult === "안전성에 문제 없음"}
            onValueChange={(newValue) =>
              setOverallEvaluation({
                ...overallEvaluation,
                overallResult: newValue ? "안전성에 문제 없음" : "",
              })
            }
            color={
              overallEvaluation.overallResult === "안전성에 문제 없음"
                ? "#4CAF50"
                : undefined
            }
          />
          <Text style={styles.radioLabel}>안전성에 문제 없음</Text>
        </View>
        <View style={styles.radioContainer}>
          <Checkbox
            value={
              overallEvaluation.overallResult === "구조적 문제 발생 가능성 있음"
            }
            onValueChange={(newValue) =>
              setOverallEvaluation({
                ...overallEvaluation,
                overallResult: newValue ? "구조적 문제 발생 가능성 있음" : "",
              })
            }
            color={
              overallEvaluation.overallResult === "구조적 문제 발생 가능성 있음"
                ? "#4CAF50"
                : undefined
            }
          />
          <Text style={styles.radioLabel}>구조적 문제 발생 가능성 있음</Text>
        </View>

        {/* 모니터링 필요 여부 */}
        <Text style={styles.label}>모니터링 필요 여부:</Text>
        <View style={styles.radioContainer}>
          <Checkbox
            value={overallEvaluation.monitoringRequired === "필요"}
            onValueChange={(newValue) =>
              setOverallEvaluation({
                ...overallEvaluation,
                monitoringRequired: newValue ? "필요" : "",
              })
            }
            color={
              overallEvaluation.monitoringRequired === "필요"
                ? "#4CAF50"
                : undefined
            }
          />
          <Text style={styles.radioLabel}>필요</Text>
          <Checkbox
            value={overallEvaluation.monitoringRequired === "불필요"}
            onValueChange={(newValue) =>
              setOverallEvaluation({
                ...overallEvaluation,
                monitoringRequired: newValue ? "불필요" : "",
              })
            }
            color={
              overallEvaluation.monitoringRequired === "불필요"
                ? "#4CAF50"
                : undefined
            }
          />
          <Text style={styles.radioLabel}>불필요</Text>
        </View>

        {/* 다음 점검 일정 */}
        <Text style={styles.label}>다음 점검 일정:</Text>
        <TextInput
          style={styles.input}
          value={overallEvaluation.nextInspectionDate}
          onChangeText={(text) =>
            setOverallEvaluation({
              ...overallEvaluation,
              nextInspectionDate: text,
            })
          }
          placeholder="다음 점검 일정을 입력하세요"
        />

        {/* 제출하기 버튼 */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>제출하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

/** =========================================
 *       메인 ChecklistScreen 컴포넌트
 * ========================================= */
const ChecklistScreen = () => {
  // 탭 상태
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "basicInfo", title: "기본 정보" },
    { key: "defect", title: "결함 입력" },
    { key: "evaluation", title: "종합 평가" },
  ]);

  // ✅ PDF 관련
  const [pdfUrl, setPdfUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // =========================
  //  모든 상태를 부모에서 관리
  // =========================
  const [basicInfo, setBasicInfo] = useState({
    inspectionNumber: "",
    inspectionDate: "",
    inspectorName: "",
    inspectorContact: "",
    address: "",
  });

  const [defectTypes, setDefectTypes] = useState({
    concreteCrack: false,
    waterLeak: false,
    steelDamage: false,
    spalling: false,
    rebarExposure: false,
    paintDamage: false,
  });

  const [concreteCrack, setConcreteCrack] = useState({
    type: "",
    length: "",
    width: "",
    depth: "",
    leakage: "",
    movement: "",
    change: "",
    condition: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [waterLeak, setWaterLeak] = useState({
    leakageRange: "",
    leakageCause: "",
    eflorescence: "",
    impact: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [steelDamage, setSteelDamage] = useState({
    damageRange: "",
    damageSeverity: "",
    damageCause: "",
    stabilityImpact: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [spalling, setSpalling] = useState({
    range: "",
    cause: "",
    stabilityImpact: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [rebarExposure, setRebarExposure] = useState({
    range: "",
    condition: "",
    cause: "",
    stabilityImpact: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [paintDamage, setPaintDamage] = useState({
    damageRange: "",
    damageCause: "",
    damageSeverity: "",
    emergency: "",
    emergencyAction: "",
    repairPlan: "",
  });

  const [overallEvaluation, setOverallEvaluation] = useState({
    overallResult: "",
    monitoringRequired: "",
    nextInspectionDate: "",
  });

  // ======================
  //   Google Docs Viewer
  // ======================
  const BASE_URL =
    "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net";

  const getGoogleDocsViewerUrl = (url) => {
    if (!url) return "";
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url
    )}`;
  };

  const openPdfModal = (url) => {
    if (!url) return;
    // 절대 URL 생성
    const absoluteUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
    // Google Docs Viewer URL 생성
    const googleDocsUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(absoluteUrl)}`;
    console.log("📄 원본 PDF URL:", absoluteUrl);
    console.log("📄 변환된 Google Docs URL:", googleDocsUrl);
    setPdfUrl(googleDocsUrl);
    setModalVisible(true);
  };

  const pdfViewer = useMemo(() => {
    if (!pdfUrl) return null;
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <WebView
          source={{ uri: pdfUrl }}
          style={{ flex: 1 }}
          startInLoadingState={true}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          onLoadStart={() => console.log("🔄 PDF 로딩 시작")}
          onLoad={() => console.log("✅ PDF 로딩 완료")}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("🚨 PDF 로딩 오류:", nativeEvent);
          }}
        />
      </View>
    );
  }, [pdfUrl]);

  // ======================
  //   체크리스트 제출 로직
  // ======================
  const handleSubmit = async () => {
    if (!basicInfo.inspectionNumber.trim()) {
      Alert.alert("오류", "점검 번호를 입력해주세요.");
      return;
    }

    // 서버에 전송할 formData 구성
    const formData = {
      inspection_id: basicInfo.inspectionNumber,
      inspection_date: basicInfo.inspectionDate,
      inspector_name: basicInfo.inspectorName,
      inspector_contact: basicInfo.inspectorContact,
      address: basicInfo.address,
      defect_types: [],

      // 콘크리트 균열
      concrete_crack_type: concreteCrack.type,
      concrete_crack_length_cm: concreteCrack.length,
      concrete_crack_width_mm: concreteCrack.width,
      concrete_crack_depth_mm: concreteCrack.depth,
      concrete_crack_leakage: concreteCrack.leakage,
      concrete_crack_movement: concreteCrack.movement,
      concrete_crack_change: concreteCrack.change,
      concrete_crack_condition: concreteCrack.condition,
      concrete_crack_emergency: concreteCrack.emergency,
      concrete_crack_emergency_action: concreteCrack.emergencyAction,
      concrete_crack_repair_plan: concreteCrack.repairPlan,

      // 누수/백태
      leak_eflo_leakage_range: waterLeak.leakageRange,
      leak_eflo_leakage_cause: waterLeak.leakageCause,
      leak_eflo_eflorescence: waterLeak.eflorescence,
      leak_eflo_impact: waterLeak.impact,
      leak_eflo_emergency: waterLeak.emergency,
      leak_eflo_emergency_action: waterLeak.emergencyAction,
      leak_eflo_repair_plan: waterLeak.repairPlan,

      // 강재 손상
      steel_damage_range: steelDamage.damageRange,
      steel_damage_severity: steelDamage.damageSeverity,
      steel_damage_cause: steelDamage.damageCause,
      steel_damage_stability_impact: steelDamage.stabilityImpact,
      steel_damage_emergency: steelDamage.emergency,
      steel_damage_emergency_action: steelDamage.emergencyAction,
      steel_damage_repair_plan: steelDamage.repairPlan,

      // 박리
      delamination_range: spalling.range,
      delamination_cause: spalling.cause,
      delamination_stability_impact: spalling.stabilityImpact,
      delamination_emergency: spalling.emergency,
      delamination_emergency_action: spalling.emergencyAction,
      delamination_repair_plan: spalling.repairPlan,

      // 철근 노출
      rebar_exposure_range: rebarExposure.range,
      rebar_exposure_condition: rebarExposure.condition,
      rebar_exposure_cause: rebarExposure.cause,
      rebar_exposure_stability_impact: rebarExposure.stabilityImpact,
      rebar_exposure_emergency: rebarExposure.emergency,
      rebar_exposure_emergency_action: rebarExposure.emergencyAction,
      rebar_exposure_repair_plan: rebarExposure.repairPlan,

      // 도장 손상
      paint_damage_range: paintDamage.damageRange,
      paint_damage_cause: paintDamage.damageCause,
      paint_damage_condition: paintDamage.damageSeverity,
      paint_damage_emergency: paintDamage.emergency,
      paint_damage_emergency_action: paintDamage.emergencyAction,
      paint_damage_repair_plan: paintDamage.repairPlan,

      // 종합 평가
      overall_result: overallEvaluation.overallResult,
      monitoring_required: overallEvaluation.monitoringRequired,
      next_inspection_date: overallEvaluation.nextInspectionDate,
    };

    // defect_types 설정
    if (defectTypes.concreteCrack) formData.defect_types.push("콘크리트 균열");
    if (defectTypes.waterLeak) formData.defect_types.push("누수/백태");
    if (defectTypes.steelDamage) formData.defect_types.push("강재 손상");
    if (defectTypes.spalling) formData.defect_types.push("박리");
    if (defectTypes.rebarExposure) formData.defect_types.push("철근 노출");
    if (defectTypes.paintDamage) formData.defect_types.push("도장 손상");

    try {
      const result = await submitChecklist(formData);
      Alert.alert("성공", "체크리스트가 성공적으로 제출되었습니다!");
      console.log("✅ 제출 성공:", result);

      if (result?.report_url) {
        // PDF 경로
        const absolutePdfUrl = `${BASE_URL}${
          result.report_url.startsWith("/")
            ? result.report_url
            : "/" + result.report_url
        }`;
        openPdfModal(absolutePdfUrl);
      }

      // 저장소에 기록
      const storedChecklists = await AsyncStorage.getItem("checklistHistory");
      const checklistHistory = storedChecklists
        ? JSON.parse(storedChecklists)
        : [];
      const newChecklist = {
        inspectionId: result?.inspection_id || "N/A",
        reportUrl: result?.report_url || "N/A",
        formData,
        submittedAt: new Date().toISOString(),
      };
      const updatedChecklists = [newChecklist, ...checklistHistory];
      await AsyncStorage.setItem(
        "checklistHistory",
        JSON.stringify(updatedChecklists)
      );

      // 필요 시 상태 초기화 원하는 경우 여기에 set~~() 호출
      // setBasicInfo({ ... });
      // setDefectTypes({ ... });
      // etc...
    } catch (error) {
      Alert.alert("오류", "체크리스트 제출 중 오류가 발생했습니다.");
      console.error("🚨 제출 실패:", error.response?.data || error.message);
    }
  };

  /** ✅ TabView 에서 사용하는 renderScene 함수 */
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "basicInfo":
        return (
          <BasicInfoTab basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
        );
      case "defect":
        return (
          <DefectTab
            defectTypes={defectTypes}
            setDefectTypes={setDefectTypes}
            concreteCrack={concreteCrack}
            setConcreteCrack={setConcreteCrack}
            waterLeak={waterLeak}
            setWaterLeak={setWaterLeak}
            steelDamage={steelDamage}
            setSteelDamage={setSteelDamage}
            spalling={spalling}
            setSpalling={setSpalling}
            rebarExposure={rebarExposure}
            setRebarExposure={setRebarExposure}
            paintDamage={paintDamage}
            setPaintDamage={setPaintDamage}
          />
        );
      case "evaluation":
        return (
          <EvaluationTab
            overallEvaluation={overallEvaluation}
            setOverallEvaluation={setOverallEvaluation}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        title="체크리스트 작성"
        logoSource={require("../../../assets/images/logo.png")}
        backButtonSource={require("../../../assets/images/back-arrow.png")}
      />
      {/* 전체 화면을 감싸는 TouchableWithoutFeedback (키보드 닫기) */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{ backgroundColor: "#8ABCAD" }}
                indicatorStyle={{ backgroundColor: "white", height: 3 }}
                labelStyle={{
                  color: "white",
                  fontSize: 23,
                  fontWeight: "bold",
                }}
                inactiveColor="#D0E6E2"
                activeColor="white"
              />
            )}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* PDF 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>PDF 미리보기</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#007AFF' }}>닫기</Text>
              </TouchableOpacity>
            </View>
            {pdfUrl ? (
              pdfViewer
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>PDF를 불러오는 중...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

/** =========================
 *     스타일 정의
 * ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  detailSection: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: "#8ABCAD",
    paddingBottom: 8,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 6,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 6,
    fontWeight: "bold",
    backgroundColor: "#ebf5f2",
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F4F7FB",
    shadowColor: "#D6D8D9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
    gap: 9,
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  measurementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  measurementInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  unitText: {
    fontSize: 16,
    color: "#777",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginVertical: 12,
    borderRadius: 8,
    height: 120,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
  },
  submitButtonContainer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#8ABCAD",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "black",
  },
});

export default ChecklistScreen;
