import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from "../../../components/molecules/Footer/ResidentFooter";
import CommunityStyles from "../../../styles/CommunityStyles";
import { residentCommunity } from "../../../api/communityApi";

const CommunityResidentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [searchText, setSearchText] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [posts, setPosts] = useState([]); // ✅ 게시글 상태 추가
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await residentCommunity();
        console.log("📢 API 응답 데이터:", response.data); // ✅ API 응답 확인
        if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data); // ✅ 올바르게 데이터 저장
        } else {
          console.error("🚨 Unexpected API response format:", response.data);
          setPosts([]); // ✅ 데이터가 없을 경우 빈 배열 설정
        }
      } catch (error) {
        console.error("🚨 게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (route.params?.newPost) {
      const { newPost } = route.params;
      setPosts((prevPosts) => [
        {
          id: (prevPosts.length + 1).toString(),
          ...newPost,
          date: new Date().toISOString().split("T")[0],
          views: 0,
        },
        ...prevPosts,
      ]);
    }
  }, [route.params?.newPost]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDefect, setSelectedDefect] = useState("");

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  const openSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);

  const applyFilter = () => {
    setIsFiltered(true);
    closeFilterModal();
  };

  const clearFilter = () => {
    setIsFiltered(false);
    setSelectedRegion("");
    setSelectedDefect("");
    closeFilterModal();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchText
      ? post.title.includes(searchText) || post.content?.includes(searchText)
      : true;
    const matchesRegion = selectedRegion
      ? post.region === selectedRegion
      : true;
    const matchesDefect = selectedDefect
      ? post.title.includes(selectedDefect) ||
        post.content?.includes(selectedDefect)
      : true;

    return matchesSearch && matchesRegion && matchesDefect;
  });

  const renderPost = ({ item }) => {
    console.log("📢 개별 post 데이터:", item);
    return (
      // ✅ return 추가
      <TouchableOpacity
        style={CommunityStyles.postCard}
        onPress={() =>
          navigation.navigate("Community/Resident/postDetail", {
            postId: item.communityPostId,
          })
        }
      >
        <View>
          <Text style={CommunityStyles.postTitle}>{item.communityTitle}</Text>
          <Text style={CommunityStyles.postMeta}>
            {item.userName} •{" "}
            {new Date(item.communityCreatedAt).toLocaleDateString()} • 조회{" "}
            {item.communityViews}회
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={CommunityStyles.container}>
      {/* 헤더 */}
      <View style={CommunityStyles.header}>
        <Text style={CommunityStyles.headerTitle}>커뮤니티</Text>
        <View style={CommunityStyles.headerIcons}>
          <TouchableOpacity onPress={openSearchModal}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openFilterModal}>
            <Icon
              name="filter-list"
              size={24}
              color="#000"
              style={{ marginLeft: 16 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 게시글 목록 */}
      {loading ? (
        <Text style={CommunityStyles.loadingText}>게시글 불러오는 중...</Text>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.communityPostId.toString()}
          renderItem={renderPost}
          contentContainerStyle={CommunityStyles.listContainer}
        />
      )}

      {/* 검색 모달 */}
      <Modal
        visible={isSearchModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSearchModal}
      >
        <View style={CommunityStyles.modalContainer}>
          <View style={CommunityStyles.modalContent}>
            <Text style={CommunityStyles.modalTitle}>검색</Text>
            <TextInput
              style={CommunityStyles.searchInput}
              placeholder="검색어를 입력하세요"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={CommunityStyles.modalButton}
              onPress={closeSearchModal}
            >
              <Text style={CommunityStyles.modalButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  onPress={() =>
                    setSelectedRegion(
                      selectedRegion === item ||
                        (item === "부산 구 전체" && selectedRegion === "")
                        ? ""
                        : item
                    )
                  } // 선택된 항목 누르면 해제
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
                  onPress={
                    () => setSelectedDefect(selectedDefect === item ? "" : item) // 같은 결함 클릭 시 해제
                  }
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

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20, // 화면 아래쪽
          right: 20, // 화면 오른쪽
          backgroundColor: "green",
          padding: 15,
          borderRadius: 30,
          elevation: 5, // 안드로이드에서 그림자 효과
          zIndex: 1, // 버튼이 FlatList 위에 오도록 설정
        }}
        onPress={() => navigation.navigate("Community/Resident/post")} // 글쓰기 화면으로 이동
      >
        <Icon name="edit" size={24} color="#FFF" />
      </TouchableOpacity>

      <Footer />
    </View>
  );
};

export default CommunityResidentScreen;
