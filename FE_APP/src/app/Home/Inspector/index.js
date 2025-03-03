import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Dimensions,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import Footer from "../../../components/molecules/Footer/InspectorFooter";
import MainStyles from "../../../styles/MainStyles";
import ImageCard from "../../../components/atoms/Card/ImageCard";
import SlideCard from "../../../components/atoms/Card/SlideCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const MainInspectorScreen = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  // ID를 AsyncStorage에서 가져오는 useEffect
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // 슬라이드 데이터 정의
  const slideData = [
    {
      id: "1",
      image: require("../../../../assets/images/ceiling.png"),
      title: "천장에 금이 갔는데..",
      subtitle: "조회수: 128",
      post: {
        id: "1",
        title: "천장에 금이 갔는데..",
        author: "이건호",
        date: "2025-01-25",
        views: 128,
        content: "천장에 균열이 생겼습니다.",
        region: "부산",
      },
    },
    {
      id: "2",
      image: require("../../../../assets/images/paint.png"),
      title: "지원금 관련 질문이요",
      subtitle: "조회수: 94",
      post: {
        id: "2",
        title: "지원금 관련 질문이요",
        author: "김태영",
        date: "2025-01-24",
        views: 94,
        content: "서울에서 지원금을 받으려면 어떻게 해야 하나요?",
        region: "서울",
      },
    },
  ];

  // 슬라이드 카드별 애니메이션 상태 관리
  const slideScales = {};
  slideData.forEach((item) => {
    slideScales[item.id] = useSharedValue(1); // 각 카드에 대해 초기 애니메이션 값 설정
  });

  const handlePressIn = (id) => {
    slideScales[id].value = withSpring(1.05, { damping: 10 }); // 특정 카드만 확대
  };

  const handlePressOut = (id) => {
    slideScales[id].value = withSpring(1, { damping: 10 }); // 특정 카드만 원래 크기로
  };

  // 상단 아이콘 데이터
  const quickAccessItems = [
    {
      id: "1",
      icon: require("../../../../assets/images/report.png"),
      label: "점검내역",
      onPress: () => navigation.navigate("Report/Inspector/index"),
    },
    {
      id: "2",
      icon: require("../../../../assets/images/community.png"),
      label: "커뮤니티",
      onPress: () => navigation.navigate("Community/Inspector/index"),
    },

    {
      id: "3",
      icon: require("../../../../assets/images/notice.png"),
      label: "체크리스트",
      onPress: () => navigation.navigate("Checklist/checklistList"),
    },
    {
      id: "4",
      icon: require("../../../../assets/images/schedule.png"),
      label: "대시보드",
      onPress: () => navigation.navigate("Inspection/index"),
    },
  ];

  return (
    <View style={MainStyles.container}>
      {/* 상단 배경 및 로고 */}
      <View
        style={[MainStyles.headerBackground, { backgroundColor: "#039568" }]}
      >
        <TouchableOpacity
          style={MainStyles.hamburgerMenu}
          onPress={() => setMenuVisible(true)}
        >
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={MainStyles.greeting}>관리자님, 안녕하세요</Text>
        <Text style={MainStyles.subGreeting}>
          원하는 서비스를 검색해주세요.
        </Text>
        <TextInput
          style={MainStyles.searchBar}
          placeholder="여기에요!"
          placeholderTextColor="#999"
        />
      </View>

      {/* 햄버거 메뉴 */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)} // 닫기
      >
        <View style={MainStyles.menuContainer}>
          <Text style={MainStyles.menuTitle}>메뉴</Text>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>마이페이지</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>신고 내역</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>커뮤니티</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>대시보드</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>점검 일정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>현장 점검</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.menuItem}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={MainStyles.menuText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 아이콘 섹션 위 텍스트 */}
      <Text style={MainStyles.sectionTitle}>바로가기</Text>

      {/* 상단 아이콘 섹션 */}
      <View style={MainStyles.quickAccessContainer}>
        {quickAccessItems.map((item) => (
          <ImageCard
            key={item.id}
            imageSource={item.icon}
            label={item.label}
            onPress={item.onPress}
          />
        ))}
      </View>

      {/* 슬라이드 위에 텍스트와 더보기 */}
      <View style={MainStyles.slideHeader}>
        <Text style={MainStyles.slideTitle}>점검자 커뮤니티</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Community/Inspector/index")}
        >
          <Text style={MainStyles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>

      {/* 슬라이드 섹션 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={MainStyles.slideContainer}
      >
        {slideData.map((item) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [{ scale: slideScales[item.id].value }],
            };
          });

          return (
            <TouchableWithoutFeedback
              key={item.id}
              onPressIn={() => handlePressIn(item.id)}
              onPressOut={() => handlePressOut(item.id)}
              onPress={() =>
                navigation.navigate("Community/Resident/postDetail", {
                  post: item.post,
                })
              }
            >
              <Animated.View style={[MainStyles.slideEffect, animatedStyle]}>
                <SlideCard
                  imageSource={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <Footer />
    </View>
  );
};

export default MainInspectorScreen;
