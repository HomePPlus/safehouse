import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Header from "../../../components/molecules/Header/Header";
import { useNavigation } from "@react-navigation/native";
import PostStyles from "../../../styles/PostStyles";
import { postResidentCommunity } from "../../../api/communityApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostResidentScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // 사용자 정보 상태

  // 로그인한 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          console.log("로그인 정보 불러오기 성공", userData); // 로그인 정보가 있다면
          setUser(JSON.parse(userData)); // JSON 문자열을 객체로 변환하여 상태에 저장
        } else {
          console.log("로그인 정보가 없습니다."); // 로그인 정보가 없으면
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      }
    };
    fetchUser();
  }, []); // 한 번만 실행되도록 설정

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (!user) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await postResidentCommunity({
        title,
        content,
        userId: user.id, // 로그인한 사용자의 ID 추가
        username: user.username, // 사용자 이름 추가 (필요하면)
      });

      if (response?.status === 201) {
        Alert.alert("성공", "게시물이 등록되었습니다.", [
          {
            text: "확인",
            onPress: () =>
              navigation.navigate("Community/Resident/index", {
                newPost: { title, content, username: user.username },
              }),
          },
        ]);
      } else {
        Alert.alert("오류", "게시물을 등록할 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={PostStyles.container}>
      <Header
        title="글 쓰기"
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
      />
      <Text style={PostStyles.pageTitle}>생각을 남겨보세요.</Text>

      <View style={PostStyles.inputGroup}>
        <Text style={PostStyles.label}>제목</Text>
        <TextInput
          style={PostStyles.input}
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={PostStyles.inputGroup}>
        <Text style={PostStyles.label}>내용</Text>
        <TextInput
          style={[PostStyles.input, PostStyles.contentInput]}
          placeholder="내용을 입력하세요"
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity
        style={PostStyles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={PostStyles.buttonText}>
          {loading ? "등록 중..." : "완료"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostResidentScreen;
