import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // 아이콘 라이브러리 추가
import Footer from "../../../components/molecules/Footer/InspectorFooter";
import ReportHistoryStyles from "../../../styles/ReportHistoryStyles";
import {
  fetchReports,
  fetchReportDetail,
  fetchRegularInspections,
  fetchInspectorCommunities,
} from "../../../api/reportApi"; // API 추가

const ReportInspectorHistoryScreen = () => {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);
  const [inspectorCommunities, setInspectorCommunities] = useState([]); // 커뮤니티 데이터
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null); // 선택된 커뮤니티

  // 1. 백엔드에서 데이터 조회
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const reportsData = await fetchReports();
        if (Array.isArray(reportsData)) {
          setReports(reportsData);
        }

        const communitiesData = await fetchInspectorCommunities(); // 검사관 커뮤니티 데이터 로드
        if (Array.isArray(communitiesData.data)) {
          setInspectorCommunities(communitiesData.data);
        }
      } catch (error) {
        console.error("🚨 데이터 조회 실패:", error);
        Alert.alert("오류", "데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. 커뮤니티 상세 모달 열기
  const openCommunityModal = (community) => {
    setSelectedCommunity(community);
    setModalVisible(true);
  };

  const handleCreatePost = () => {
    navigation.navigate("Community/Inspector/post"); // 게시글 페이지로 이동합니다.
  };

  return (
    <View style={ReportHistoryStyles.container}>
      <View style={ReportHistoryStyles.header}>
        <Text style={ReportHistoryStyles.title}>커뮤니티 게시글</Text>
      </View>

      {/* 로딩 중 */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7D40E7"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={inspectorCommunities}
          keyExtractor={(item) => item.inspectorPostId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openCommunityModal(item)}>
              <View style={ReportHistoryStyles.reportCard}>
                <Text style={ReportHistoryStyles.reportIndex}>
                  {item.inspectorPostId}
                </Text>
                <View style={ReportHistoryStyles.reportContent}>
                  <Text style={ReportHistoryStyles.reportDescription}>
                    {item.inspectorCommunityTitle}
                  </Text>
                  <Text style={ReportHistoryStyles.reportDate}>
                    {new Date(
                      item.inspectorCommunityCreatedAt
                    ).toLocaleDateString()}{" "}
                    {/* 날짜만 표시 */}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 커뮤니티 상세 모달 */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={ReportHistoryStyles.modalBackground}>
          <View style={ReportHistoryStyles.modalContainer}>
            {selectedCommunity && (
              <>
                <Text style={ReportHistoryStyles.modalTitle}>
                  {selectedCommunity.inspectorCommunityTitle}
                </Text>
                <Text style={ReportHistoryStyles.modalLabel}>
                  작성자: {selectedCommunity.inspectorName}
                </Text>
                <Text style={ReportHistoryStyles.modalLabel}>
                  날짜:{" "}
                  {new Date(
                    selectedCommunity.inspectorCommunityCreatedAt
                  ).toLocaleDateString()}
                </Text>
                <Text style={ReportHistoryStyles.modalContent}>
                  {selectedCommunity.inspectorCommunityContent}
                </Text>
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

      {/* 게시글 작성 버튼 */}
      <TouchableOpacity
        onPress={handleCreatePost}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "green",
          padding: 15,
          borderRadius: 30,
          elevation: 5,
          zIndex: 1,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          <Icon name="edit" size={24} color="#FFF" />
        </Text>
      </TouchableOpacity>

      <Footer />
    </View>
  );
};

export default ReportInspectorHistoryScreen;
