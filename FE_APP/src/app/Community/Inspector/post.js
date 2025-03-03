import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Header from "../../../components/molecules/Header/Header";
import { useNavigation } from "@react-navigation/native";
import PostStyles from "../../../styles/PostStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostInspectorScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("📢 토큰:", token);

      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      const requestBody = {
        inspectorCommunityTitle: title,
        inspectorCommunityContent: content,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 요청 정보 상세 로깅
      console.log("📢 요청 상세 정보:");
      console.log(
        "URL:",
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspector_communities"
      );
      console.log("Headers:", JSON.stringify(headers, null, 2));
      console.log("Body:", JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net/api/inspector_communities",
        requestBody,
        {
          headers: headers,
        }
      );

      // 응답 정보 상세 로깅
      console.log("📢 응답 상세 정보:");
      console.log("Status:", response.status);
      console.log("Headers:", JSON.stringify(response.headers, null, 2));
      console.log("Cache-Control:", response.headers["cache-control"]);
      console.log("Data:", JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        Alert.alert("성공", "게시물이 등록되었습니다.", [
          {
            text: "확인",
            onPress: () => navigation.navigate("Community/Inspector/index"),
          },
        ]);
      } else {
        Alert.alert("오류", "게시물을 등록할 수 없습니다.");
      }
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:");
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      if (error.response?.headers["cache-control"]) {
        console.error(
          "Error Cache-Control:",
          error.response.headers["cache-control"]
        );
      }
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={PostStyles.container}>
      <Header
        title="게시글 작성"
        logoSource={require("../../../../assets/images/logo.png")}
        backButtonSource={require("../../../../assets/images/back-arrow.png")}
      />
      <Text style={PostStyles.pageTitle}>게시글을 작성하세요.</Text>

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

export default PostInspectorScreen;
