import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthColors } from "../styles/AuthColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../app/Loading/index";

// Import screens
import SplashScreen from "../app/Splash/index";
import LoginScreen from "../app/Login/index";
import SignupScreen from "../app/Signup/index";
import SignupResident from "../app/Signup/Resident/index";
import SignupResidentVerify from "../app/Signup/Resident/verifyEmail";
import SignupResidentSetPassword from "../app/Signup/Resident/setPassword";
import SignupResidentDetails from "../app/Signup/Resident/details";
import SignupInspector from "../app/Signup/Inspector/index";
import SignupInspectorVerify from "../app/Signup/Inspector/verifyEmail";
import SignupInspectorSetPassword from "../app/Signup/Inspector/setPassword";
import SignupInspectorDetails from "../app/Signup/Inspector/details";
import FindIDScreen from "../app/Login/findID";
import FindPWScreen from "../app/Login/findPW";
import FindIDResultScreen from "../app/Login/findIDResult";
import FindPWResultScreen from "../app/Login/findPWResult";

import MainResidentScreen from "../app/Home/Resident/index";
import ReportResidentScreen from "../app/Report/Resident";
import ModelingScreen from "../app/Report/Resident/modelingScreen";
import ReportResidentHistoryScreen from "../app/Report/Resident/reportHistory";
import CommunityResidentScreen from "../app/Community/Resident";
import PostResidentScreen from "../app/Community/Resident/post";
import PostDetailResidentScreen from "../app/Community/Resident/postDetail";

import MainInspectorScreen from "../app/Home/Inspector/index";
import ReportInspectorHistoryScreen from "../app/Report/Inspector";
import DashboardScreen from "../app/Inspection/index";
import MyDashboardScreen from "../app/Inspection/Status/myDashboard";
import RegularScheduleScreen from "../app/Inspection/Schedule/regularSchedule";
import ReportScheduleScreen from "../app/Inspection/Schedule/reportSchedule";
import InspectionListScreen from "../app/Inspection/List/index";
import InspectionDetailScreen from "../app/Inspection/List/detailList";
import EmptyPage from "../app/Inspection/Schedule/EmptyPage";
import ChecklistListScreen from "../app/Checklist/checklistList";
import PdfViewer from "../app/Checklist/pdfViewer";
import ChecklistFormViewer from "../app/Checklist/checklistFormViewer";
import ChecklistScreen from "../app/Checklist/index";
import CameraScreen from "../app/Home/Inspector/cameraScreen";

const Stack = createStackNavigator();
const InspectionStack = createStackNavigator();

const InspectionStackScreen = () => {
  return (
    <InspectionStack.Navigator>
      <InspectionStack.Screen
        name="RegularScheduleScreen"
        component={RegularScheduleScreen}
        options={{ headerTitle: "정기 점검 일정 예약" }}
      />
      <InspectionStack.Screen
        name="ReportScheduleScreen"
        component={ReportScheduleScreen}
        options={{ headerTitle: "신고 점검 일정 예약" }}
      />
      <InspectionStack.Screen
        name="EmptyPage"
        component={EmptyPage}
        options={{ headerTitle: "빈 페이지" }}
      />
    </InspectionStack.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // userType만 확인 (쿠키는 자동으로 처리됨)
      const savedUserType = await AsyncStorage.getItem("userType");
      if (savedUserType) {
        setUserType(savedUserType.toLowerCase());
      }
    } catch (error) {
      console.error("로그인 상태 확인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {console.log("NavigationContainer is rendering")}
      <Stack.Navigator
        initialRouteName={
          userType
            ? userType === "inspector"
              ? "Home/Inspector/index"
              : "Home/Resident/index"
            : "Login"
        }
        screenOptions={{
          headerStyle: {
            backgroundColor: AuthColors.headerBackground,
          },
          headerTintColor: AuthColors.headerText,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // 헤더 숨김
        />
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: "로그인",
            headerShown: false,
          }}
        />
        {/* Signup Screen */}
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerTitle: "회원가입",
            headerShown: false,
          }}
        />
        {/* Resident Signup Screen */}
        <Stack.Screen
          name="SignupResident"
          component={SignupResident}
          options={{
            headerTitle: "입주민 회원가입",
          }}
        />
        {/* Resident Signup Email Verify Screen */}
        <Stack.Screen
          name="SignupResidentVerify"
          component={SignupResidentVerify}
          options={{
            headerTitle: "입주민 회원가입 이메일 인증",
          }}
        />
        {/* Resident Signup Set Password Screen */}
        <Stack.Screen
          name="SignupResidentSetPassword"
          component={SignupResidentSetPassword}
          options={{
            headerTitle: "입주민 회원가입 패스워드 설정",
          }}
        />
        {/* Resident Signup Details Screen */}
        <Stack.Screen
          name="SignupResidentDetails"
          component={SignupResidentDetails}
          options={{
            headerTitle: "입주민 회원가입 추가 정보 설정",
          }}
        />

        {/* Inspector Signup Screen */}
        <Stack.Screen
          name="SignupInspector"
          component={SignupInspector}
          options={{
            headerTitle: "점검자 회원가입",
          }}
        />
        {/* Inspector Signup Email Verify Screen */}
        <Stack.Screen
          name="SignupInspectorVerify"
          component={SignupInspectorVerify}
          options={{
            headerTitle: "점검자 회원가입 이메일 인증",
          }}
        />
        {/* Inspector Signup Set Password Screen */}
        <Stack.Screen
          name="SignupInspectorSetPassword"
          component={SignupInspectorSetPassword}
          options={{
            headerTitle: "점검자 회원가입 패스워드 설정",
          }}
        />
        {/* Inspector Signup Details Screen */}
        <Stack.Screen
          name="SignupInspectorDetails"
          component={SignupInspectorDetails}
          options={{
            headerTitle: "점검자 회원가입 추가 정보 설정",
          }}
        />

        {/* Find ID Screen */}
        <Stack.Screen
          name="FindIDScreen"
          component={FindIDScreen}
          options={{
            headerTitle: "ID 찾기",
            headerShown: false,
          }}
        />
        {/* Find ID Result Screen */}
        <Stack.Screen
          name="FindIDResultScreen"
          component={FindIDResultScreen}
          options={{
            headerTitle: "ID 찾기 결과",
            headerShown: false,
          }}
        />

        {/* Find PW Screen */}
        <Stack.Screen
          name="FindPWScreen"
          component={FindPWScreen}
          options={{
            headerTitle: "PW 찾기",
            headerShown: false,
          }}
        />
        {/* Find PW Result Screen */}
        <Stack.Screen
          name="FindPWResultScreen"
          component={FindPWResultScreen}
          options={{
            headerTitle: "PW 찾기 결과",
            headerShown: false,
          }}
        />

        {/* Resident Main Screen */}
        <Stack.Screen
          name="MainResidentScreen"
          component={MainResidentScreen}
          options={{
            headerTitle: "입주민 메인페이지",
            headerShown: false,
          }}
        />
        {/* Resident Report Screen */}
        <Stack.Screen
          name="ReportResidentScreen"
          component={ReportResidentScreen}
          options={{
            headerTitle: "입주민 신고 페이지",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ModelingScreen"
          component={ModelingScreen}
          options={{
            headerTitle: "모델링결과페이지",
            headerShown: false,
          }}
        />

        {/* Resident Report History Screen */}
        <Stack.Screen
          name="ReportResidentHistoryScreen"
          component={ReportResidentHistoryScreen}
          options={{
            headerTitle: "입주민 신고 내역 페이지",
            headerShown: false,
          }}
        />
        {/* Resident Community Screen */}
        <Stack.Screen
          name="CommunityResidentScreen"
          component={CommunityResidentScreen}
          options={{
            headerTitle: "입주민 커뮤니티 목록 페이지",
            headerShown: false,
          }}
        />
        {/* Resident Community Post Screen */}
        <Stack.Screen
          name="PostResidentScreen"
          component={PostResidentScreen}
          options={{
            headerTitle: "입주민 커뮤니티 글쓰기 페이지",
            headerShown: false,
          }}
        />
        {/* Resident Community Post Detail Screen */}
        <Stack.Screen
          name="PostDetailResidentScreen"
          component={PostDetailResidentScreen}
          options={{
            headerTitle: "입주민 커뮤니티 글 보기 페이지",
            headerShown: false,
          }}
        />

        {/* Inspector Main Screen */}
        <Stack.Screen
          name="MainInspectorScreen"
          component={MainInspectorScreen}
          options={{
            headerTitle: "점검자 메인페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Report History Screen */}
        <Stack.Screen
          name="ReportInspectorHistoryScreen"
          component={ReportInspectorHistoryScreen}
          options={{
            headerTitle: "점검자 신고 내역 볼 수 있는 페이지",
            headerShown: false,
          }}
        />

        {/* Inspector Inspection Dashboard Screen */}
        <Stack.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{
            headerTitle: "전체 점검자 점검 대시보드 페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Inspection My Dashboard Screen */}
        <Stack.Screen
          name="MyDashboardScreen"
          component={MyDashboardScreen}
          options={{
            headerTitle: "개인 점검자 점검 대시보드 페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Inspection Schedule Stack */}
        <Stack.Screen
          name="InspectionSchedule"
          component={InspectionStackScreen}
          options={{ headerShown: false }}
        />
        {/* Inspector Inspection List Screen */}
        <Stack.Screen
          name="InspectionListScreen"
          component={InspectionListScreen}
          options={{
            headerTitle: "점검자 점검 목록 페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Inspection List Detail Screen */}
        <Stack.Screen
          name="InspectionDetailScreen"
          component={InspectionDetailScreen}
          options={{
            headerTitle: "점검자 점검 목록 상세 페이지",
            headerShown: false,
          }}
        />

        {/* Inspector Checklist List Screen */}
        <Stack.Screen
          name="ChecklistListScreen"
          component={ChecklistListScreen}
          options={{
            headerTitle: "점검자 체크리스트 총 목록 페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Checklist PDF Viewer Screen */}
        <Stack.Screen
          name="PdfViewer"
          component={PdfViewer}
          options={{
            headerTitle: "점검자 체크리스트 PDF 뷰어 페이지",
            headerShown: false,
          }}
        />
        {/* Inspector Checklist Viewer Screen */}
        <Stack.Screen
          name="ChecklistFormViewer"
          component={ChecklistFormViewer}
          options={{
            headerTitle: "점검자 체크리스트 뷰어 페이지",
            headerShown: false,
          }}
        />

        {/* Inspector Checklist Screen */}
        <Stack.Screen
          name="ChecklistScreen"
          component={ChecklistScreen}
          options={{
            headerTitle: "점검자 체크리스트 페이지",
            headerShown: false,
          }}
        />

        {/* Inspector Footer Camera Screen */}
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{
            headerTitle: "점검자 푸터 카메라 바로가기 페이지",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
