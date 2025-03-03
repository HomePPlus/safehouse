import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SplashStyles from "../../styles/SplashStyles";
import { AuthColors } from "../../styles/AuthColors";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const colors = [
  "#A5D6A7", // 연한 초록색
  "#C8E6C9", // 더 연한 초록색
  "#E8F5E9", // 아주 연한 초록색
];

const SplashScreen = () => {
  const navigation = useNavigation();
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const waveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 물결 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 로고 애니메이션
    Animated.parallel([
      // 크기 커지는 애니메이션
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      // 페이드인 애니메이션
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // 회전 애니메이션
      Animated.sequence([
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 400,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 프로그레스 바 애니메이션
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bezier(0.4, 0, 0.2, 1), // 부드러운 가속/감속
      useNativeDriver: false,
    }).start();

    // 배경색 애니메이션
    const animateColors = () => {
      backgroundAnimation.setValue(0);
      Animated.timing(backgroundAnimation, {
        toValue: colors.length - 1,
        duration: 2500,
        useNativeDriver: false,
      }).start(() => animateColors());
    };

    animateColors();

    // 2.5초 후 로그인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.navigate("Login/index");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, progressAnimation, backgroundAnimation]);

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 프로그레스 바의 너비를 애니메이션으로 조절
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // 배경색 interpolator
  const backgroundColor = backgroundAnimation.interpolate({
    inputRange: colors.map((_, index) => index),
    outputRange: colors,
  });

  const waveTransform = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={[SplashStyles.container, { backgroundColor: colors[0] }]}>
      {/* 물결 효과 배경 */}
      {[...Array(3)].map((_, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: width * 2,
            height: height,
            backgroundColor: colors[i + 1],
            opacity: 0.3,
            borderRadius: height,
            transform: [
              { translateX: waveTransform },
              { translateY: height / 2 + i * 20 },
              { scale: 1.5 },
            ],
          }}
        />
      ))}

      {/* 로고 애니메이션 */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnimation }, { rotate: rotate }],
          opacity: opacityAnimation,
          zIndex: 1,
        }}
      >
        <Image
          source={require("../../../assets/images/splash.png")}
          style={SplashStyles.image}
        />
      </Animated.View>

      {/* 프로그레스 바 */}
      <View
        style={{
          width: "70%",
          height: 6,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
          marginTop: 30,
          zIndex: 1,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Animated.View
          style={{
            width: progressWidth,
            height: "100%",
            backgroundColor: "#fff", // 프로그레스 바를 흰색으로
            borderRadius: 3,
            shadowColor: "#fff",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 5,
          }}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
