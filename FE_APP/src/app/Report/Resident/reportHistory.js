import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Footer from "../../../components/molecules/Footer/ResidentFooter";
import FilterModal from "../../../components/molecules/Filter/FilterModal";
import ReportHistoryStyles from "../../../styles/ReportHistoryStyles";
import { fetchReports, fetchReportDetail, updateReport, deleteReport } from "../../../api/reportApi";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportResidentHistoryScreen = () => {
  const route = useRoute();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editDefectType, setEditDefectType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMode, setEditMode] = useState(false); // ✅ 수정 모드 추가



  // ✅ 신고 내역 불러오기 (API)
  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetchReports(); // API 호출
      console.log("✅ [DEBUG] 신고 내역 불러오기 성공:", response);

      setReports(response); // 전체 리스트 저장
      setFilteredReports(response); // 필터링된 리스트 저장
    } catch (error) {
      console.error("🚨 [DEBUG] 신고 내역 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 신고 상세 조회 (API)
  const loadReportDetail = async (reportId) => {
    try {
      const reportDetail = await fetchReportDetail(reportId);
      console.log("✅ [DEBUG] 신고 상세 조회 성공:", reportDetail);
      setSelectedReport(reportDetail);
      setModalVisible(true);
    } catch (error) {
      console.error("🚨 [DEBUG] 신고 상세 조회 실패:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedData = {
        reportDetailAddress: editAddress,
        defectType: editDefectType,
        reportDescription: editDescription,
      };
  
      await updateReport(selectedReport.id, updatedData);
      console.log("✅ [DEBUG] 신고 수정 완료:", updatedData);
  
      // ✅ 수정된 항목을 리스트에 반영
      const updatedReports = reports.map((r) =>
        r.id === selectedReport.id ? { ...r, ...updatedData } : r
      );
      setReports(updatedReports);
      setFilteredReports(updatedReports);
  
      setModalVisible(false); // ✅ 수정 후 모달 닫기
    } catch (error) {
      console.error("🚨 신고 수정 실패:", error);
    }
  };
  

  const handleDelete = async (reportId) => {
    try {
      await deleteReport(reportId);
      console.log(`✅ [DEBUG] 신고 삭제 완료: ${reportId}`);
  
      // ✅ 삭제된 항목을 리스트에서 제거
      const updatedReports = reports.filter((r) => r.id !== reportId);
      setReports(updatedReports);
      setFilteredReports(updatedReports);
  
      setModalVisible(false); // ✅ 삭제 후 모달 닫기
    } catch (error) {
      console.error(`🚨 신고 삭제 실패 (${reportId}):`, error);
    }
  };
  

   // ✅ 화면 처음 로딩 시 API 호출
   useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setCurrentUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error("🚨 [DEBUG] 사용자 ID 가져오기 실패:", error);
      }
    };
  
    fetchUserId();
  }, []);

  const toggleEditMode = () => {
    setEditMode(true);
    setEditAddress(selectedReport?.reportDetailAddress || "");
    setEditDefectType(selectedReport?.defectType || "");
    setEditDescription(selectedReport?.reportDescription || "");
  };
  

  // 신고하기 화면에서 전달된 데이터 확인
  useEffect(() => {
    if (route.params?.newReport) {
      const newReports = [route.params.newReport, ...reports];
      setReports(newReports);
      setFilteredReports(newReports); // 필터링된 리스트 갱신
    }
  }, [route.params?.newReport]);

  const applyFilter = (filter) => {
    if (filter === "전체") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((report) => report.status === filter));
    }
  };

  const openModal = async (reportId) => {
    try {
      await loadReportDetail(reportId);
      setModalVisible(true);
    } catch (error) {
      console.error("🚨 신고 상세 조회 실패:", error);
    }
  };

  const closeModal = () => {
    setSelectedReport(null);
    setEditMode(false);
    setModalVisible(false);
  };

  return (
    <View style={ReportHistoryStyles.container}>
      {/* 헤더 */}
      <View style={ReportHistoryStyles.header}>
        <Text style={ReportHistoryStyles.title}>신고내역</Text>
        <TouchableOpacity
          style={ReportHistoryStyles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={ReportHistoryStyles.filterText}>필터</Text>
        </TouchableOpacity>
      </View>

      {/* 필터 모달 */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={applyFilter}
      />

      {/* 신고 내역 리스트 */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item.id)}>
            <View style={ReportHistoryStyles.reportCard}>
              <Text style={ReportHistoryStyles.reportIndex}>{item.id}</Text>
              <View style={ReportHistoryStyles.reportContent}>
                <Text style={ReportHistoryStyles.reportDescription}>
                  {item.reportDescription || "설명 없음"}
                </Text>
                <Text style={ReportHistoryStyles.reportDate}>
                  {item.reportDate ? item.reportDate.split("T")[0] : "날짜 없음"}
                </Text>
                <Text
                  style={[
                    ReportHistoryStyles.reportStatus,
                    item.defectType === "처리완료"
                      ? ReportHistoryStyles.statusComplete
                      : ReportHistoryStyles.statusPending,
                  ]}
                >
                  {item.defectType || "결함 정보 없음"}
                </Text>
              </View>

              {/* ✅ 본인 게시글만 수정/삭제 가능 (API에서 받은 userId와 현재 로그인한 userId 비교) */}
              {currentUserId !== null && item.userId === currentUserId && (
                <View style={ReportHistoryStyles.actionButtons}>
                  <TouchableOpacity onPress={() => {
                    setSelectedReport(item);
                    toggleEditMode();
                  }}>
                    <Text style={ReportHistoryStyles.editButton}>수정</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={ReportHistoryStyles.deleteButton}>삭제</Text>
                  </TouchableOpacity>
                </View>
            )}

            </View>
          </TouchableOpacity>
        )}
      />
      )}

      {/* 신고 상세 모달 */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={ReportHistoryStyles.modalBackground}>
          <View style={ReportHistoryStyles.modalContainer}>
            <ScrollView>
              <Text style={ReportHistoryStyles.modalTitle}>신고 상세 정보</Text>

              {/* 기존 신고 정보 (수정 전 상태) */}
              <View>
                <View style={ReportHistoryStyles.modalItem}>
                  <Text style={ReportHistoryStyles.modalLabel}>주소:</Text>
                  {editMode ? (
                    <TextInput
                      style={ReportHistoryStyles.input}
                      value={editAddress}
                      onChangeText={setEditAddress}
                      placeholder="주소 입력"
                    />
                  ) : (
                    <Text style={ReportHistoryStyles.modalValue}>{selectedReport?.reportDetailAddress || "주소 없음"}</Text>
                  )}
                </View>

                <View style={ReportHistoryStyles.modalItem}>
                  <Text style={ReportHistoryStyles.modalLabel}>결함 유형:</Text>
                  {editMode ? (
                    <TextInput
                      style={ReportHistoryStyles.input}
                      value={editDefectType}
                      onChangeText={setEditDefectType}
                      placeholder="결함 유형 입력"
                    />
                  ) : (
                    <Text style={ReportHistoryStyles.modalValue}>{selectedReport?.defectType || "결함 정보 없음"}</Text>
                  )}
                </View>

                <View style={ReportHistoryStyles.modalItem}>
                  <Text style={ReportHistoryStyles.modalLabel}>상세 내용:</Text>
                  {editMode ? (
                    <TextInput
                      style={ReportHistoryStyles.input}
                      value={editDescription}
                      onChangeText={setEditDescription}
                      placeholder="설명 입력"
                    />
                  ) : (
                    <Text style={ReportHistoryStyles.modalValue}>{selectedReport?.reportDescription || "설명 없음"}</Text>
                  )}
                </View>
              </View>


              {/* 수정 모드 활성화 시 입력 필드 표시 */}
              {editMode && (
                <>
                  <TextInput
                    style={ReportHistoryStyles.input}
                    value={editAddress}
                    onChangeText={setEditAddress}
                    placeholder="주소 입력"
                  />
                  <TextInput
                    style={ReportHistoryStyles.input}
                    value={editDefectType}
                    onChangeText={setEditDefectType}
                    placeholder="결함 유형 입력"
                  />
                  <TextInput
                    style={ReportHistoryStyles.input}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="설명 입력"
                  />
                </>
              )}

              {/* 수정 & 삭제 버튼 */}
              {selectedReport && selectedReport.userId === currentUserId && (
                <View style={ReportHistoryStyles.actionButtons}>
                  {!editMode && (
                    <TouchableOpacity style={ReportHistoryStyles.editButton} onPress={toggleEditMode}>
                      <Text style={ReportHistoryStyles.editButtonText}>수정</Text>
                    </TouchableOpacity>
                  )}

                  {editMode && (
                    <TouchableOpacity style={ReportHistoryStyles.saveButton} onPress={handleEdit}>
                      <Text style={ReportHistoryStyles.saveButtonText}>저장</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={ReportHistoryStyles.deleteButton} onPress={() => handleDelete(selectedReport.id)}>
                    <Text style={ReportHistoryStyles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}

            </ScrollView>

            <TouchableOpacity style={ReportHistoryStyles.closeButton} onPress={closeModal}>
              <Text style={ReportHistoryStyles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Footer */}
      <Footer />
    </View>
  );
};

export default ReportResidentHistoryScreen;
