import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../../../components/molecules/Header/Header";
import PostStyles from "../../../styles/PostStyles";
import {
  residentCommunityDetail,
  updateResidentCommunity,
  deleteResidentCommunity,
  createResidentCommunityComment,
} from "../../../api/communityApi"; // ✅ API 추가
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostDetailResidentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params; // ✅ postId 받아오기

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // ✅ 로그인된 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // AsyncStorage에서 로그인된 사용자 ID 가져오기
        const userId = await AsyncStorage.getItem("userId"); // 사용자 ID를 AsyncStorage에서 가져옴
        setCurrentUserId(userId); // 사용자 ID 저장
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };
    fetchUserData();
  }, []); // 한 번만 실행되도록 설정

  // ✅ API 호출하여 게시글 상세 정보 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        console.log(
          `📤 [DEBUG] 게시글 상세 요청: /api/resident_communities/${postId}`
        );
        const response = await residentCommunityDetail(postId);
        console.log("✅ [DEBUG] 응답 데이터:", response.data);
        setPost(response.data.data);
        setEditedTitle(response.data.data.communityTitle);
        setEditedContent(response.data.data.communityContent);
      } catch (error) {
        console.error("🚨 게시글 상세 조회 실패:", error);
        if (error.response) {
          console.error(
            "🚨 서버 응답 에러:",
            error.response.status,
            error.response.data
          );
        } else {
          console.error("🚨 네트워크 또는 기타 오류:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [postId]);

  // ✅ 게시글 수정
  const handleUpdatePost = async () => {
    try {
      await updateResidentCommunity(postId, {
        communityTitle: editedTitle,
        communityContent: editedContent,
      });
      setPost((prevPost) => ({
        ...prevPost,
        communityTitle: editedTitle,
        communityContent: editedContent,
      }));
      Alert.alert("성공", "게시글이 수정되었습니다.");
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("오류", "게시글 수정에 실패했습니다.");
    }
  };

  // ✅ 게시글 삭제
  const handleDeletePost = async () => {
    Alert.alert("삭제 확인", "정말로 게시글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteResidentCommunity(postId);
            Alert.alert("성공", "게시글이 삭제되었습니다.");
            navigation.goBack();
          } catch (error) {
            Alert.alert("오류", "게시글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // ✅ 댓글 추가
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await createResidentCommunityComment(postId, {
        commentContent: newComment,
      });
      setComments((prevComments) => [
        ...prevComments,
        { id: Date.now().toString(), text: newComment },
      ]);
      setNewComment("");
    } catch (error) {
      Alert.alert("오류", "댓글을 추가할 수 없습니다.");
    }
  };

  // ✅ 로딩 중이면 로딩 인디케이터 표시
  if (loading) {
    return (
      <View style={PostStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // ✅ 데이터가 없을 경우 (오류 발생)
  if (!post) {
    return (
      <View style={PostStyles.errorContainer}>
        <Text style={PostStyles.errorText}>게시글을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  // ✅ 수정 및 삭제 버튼 렌더링 (작성자만 볼 수 있도록)
  const renderActionButtons = () => {
    if (currentUserId && post && currentUserId === post.userId) {
      return (
        <View style={PostStyles.actionButtons}>
          <TouchableOpacity
            style={PostStyles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={PostStyles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={PostStyles.deleteButton}
            onPress={handleDeletePost}
          >
            <Text style={PostStyles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null; // 본인 글이 아니면 버튼 숨김
  };

  return (
    <View style={PostStyles.detailContainer}>
      {/* 헤더 */}
      <Header
        title="게시글 상세"
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
        style={{ padding: 16 }}
      />

      {/* 게시글 정보 */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={PostStyles.commentCard}>
            <Icon
              name="account-circle"
              size={24}
              color="#4CAF50"
              style={PostStyles.commentIcon}
            />
            <Text style={PostStyles.commentText}>{item.text}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* 제목 */}
            <Text style={PostStyles.title}>{post.communityTitle}</Text>

            {/* 작성 정보 */}
            <View style={PostStyles.metaInfoContainer}>
              <View style={PostStyles.metaItem}>
                <Icon name="person" size={20} color="#6C757D" />
                <Text style={PostStyles.metaText}>{post.userName}</Text>
              </View>
              <View style={PostStyles.metaItem}>
                <Icon name="calendar-today" size={20} color="#6C757D" />
                <Text style={PostStyles.metaText}>
                  {new Date(post.communityCreatedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={PostStyles.metaItem}>
                <Icon name="visibility" size={20} color="#6C757D" />
                <Text style={PostStyles.metaText}>
                  조회 {post.communityViews}회
                </Text>
              </View>
            </View>

            {/* 본문 */}
            <View style={PostStyles.card}>
              <Text style={PostStyles.content}>{post.communityContent}</Text>
            </View>

            {renderActionButtons()}
            <Text style={PostStyles.commentSectionTitle}>댓글 목록</Text>

          </View>
        }
        ListFooterComponent={
          <View>
          <View style={PostStyles.card}>
            <View>
              {/* 댓글 섹션 제목 */}
              <Text style={PostStyles.noComments}>작성된 댓글이 없습니다.</Text>
            </View>
          </View>
          <View style={PostStyles.commentInputContainer}>
          <TextInput
            style={PostStyles.commentInput}
            placeholder="댓글을 입력하세요."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={PostStyles.commentButton}
            onPress={addComment}
          >
            <Icon name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        </View>
        }
      />

      {/* 수정 모달 */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={PostStyles.detailContainer}>
          <View style={PostStyles.modalContent}>
            <TextInput
              style={PostStyles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
            />
            <TextInput
              style={[PostStyles.input, PostStyles.contentInput]}
              multiline
              value={editedContent}
              onChangeText={setEditedContent}
            />
            <TouchableOpacity
              style={PostStyles.button}
              onPress={handleUpdatePost}
            >
              <Text style={PostStyles.buttonText}>수정 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostDetailResidentScreen;
