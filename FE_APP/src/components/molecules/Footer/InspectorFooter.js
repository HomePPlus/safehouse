import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Card from "../../atoms/Card/Card";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InspectorFooter = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("home");

  const navigationItems = [
    {
      key: "home",
      iconName: "home",
      title: "Home",
      screen: "Home/Inspector/index",
    },
    {
      key: "status",
      iconName: "bar-chart",
      title: "Status",
      screen: "Report/Inspector/reportHistory",
    },
    {
      key: "camera",
      iconName: "add-circle",
      title: "Camera",
      screen: "Home/Inspector/cameraScreen",
    },
    {
      key: "notice",
      iconName: "notifications",
      title: "Notice",
      screen: "NoticeScreen",
    },
    {
      key: "logout",
      iconName: "logout",
      title: "로그아웃",
      screen: "Login/index",
    },
  ];

  const handleNavigate = (item) => {
    if (item.key === "logout") {
      Alert.alert(
        "로그아웃 하시겠습니까?",
        "로그아웃을 하시면 다시 로그인해야 합니다.",
        [
          {
            text: "아니요",
            onPress: () => console.log("로그아웃 취소"),
            style: "cancel",
          },
          {
            text: "네",
            onPress: async () => {
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("userType");
              navigation.navigate("Login/index");
            },
          },
        ]
      );
    } else {
      navigation.navigate(item.screen);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const state = navigation.getState(); // 네비게이션 상태 가져오기
      const currentRouteName = state.routes[state.index]?.name || ""; // 현재 활성화된 라우트의 이름
      const matchedItem = navigationItems.find(
        (item) => item.screen === currentRouteName
      );
      if (matchedItem) {
        setSelected(matchedItem.key); // 선택 상태 업데이트
      }
    });

    return unsubscribe; // 클린업
  }, [navigation]);

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => (
        <Card
          key={item.key}
          iconName={item.iconName}
          title={item.title}
          isSelected={selected === item.key}
          onPress={() => handleNavigate(item)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default InspectorFooter;
