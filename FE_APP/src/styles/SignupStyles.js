import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const SignupStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: AuthColors.gradientEnd,
  },
  description: {
    fontSize: 20,
    color: AuthColors.textColor,
    textAlign: "left",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  nextButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: AuthColors.buttonColor,
  },
  inactiveButton: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  resendText: {
    fontSize: 14,
    color: AuthColors.buttonColor,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
  },
  requiredLabel: {
    fontSize: 14,
    color: "red",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: AuthColors.buttonColor,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  timerText: {
    fontSize: 12,
    color: "red", // 타이머 빨간색
    marginLeft: 10,
  },
  verifiedInput: {
    borderColor: "blue",
    borderWidth: 2,
  },
  verifiedMessage: {
    color: "blue",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 5,
  },
  inputWithTimer: {
    paddingRight: 90, // 오른쪽에 공간 확보
  },
  timerInside: {
    position: "absolute",
    right: 80,
    top: "30%",
    fontSize: 12,
    color: "red", // 타이머 빨간색
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardImage: {
    width: 100, // 이미지 너비
    height: 100, // 이미지 높이
    borderRadius: 10, // 이미지 모서리 둥글게
    marginTop: 10, // 이미지와 카드 간의 간격
  },
});

export default SignupStyles;
