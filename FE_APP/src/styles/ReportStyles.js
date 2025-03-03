import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const ReportStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },

  // 진행 상태 바
  progressContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#039568",
  },

  // 헤드 설명
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  // STEP 2
  problemTypeScroll: {
    flexGrow: 1,
    maxHeight: 450,
    marginBottom: 40,
  },
  problemTypeScrollContent: {
    paddingBottom: 20,
  },
  problemTypeContainer: {
    marginTop: 20,
  },
  problemTypeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedProblemTypeCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  problemTypeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  problemTypeTextContainer: {
    flex: 1,
  },
  problemTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedProblemTypeTitle: {
    color: "#4CAF50",
  },
  problemTypeDescription: {
    fontSize: 14,
    color: "#666",
  },
  problemTypeExtra: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
  },
  selectedProblemTypeExtra: {
    color: "#4CAF50",
  },

  // STEP 3
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  imageScroll: {
    marginTop: 20,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  // 버튼 스타일
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 45,
    backgroundColor: "transparent", // 투명 배경
    borderWidth: 1,
    borderColor: "#4CAF50", // 초록색 테두리
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  // 버튼 텍스트 스타일
  buttonText: {
    color: "#4CAF50", // 초록색 텍스트
    fontSize: 16,
    fontWeight: "500",
  },

  // 5단계
  summaryCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    color: "#555",
    flex: 2,
    textAlign: "right",
  },
  imageSection: {
    marginTop: 20,
  },
  imageScroll: {
    marginTop: 10,
  },
  imageWrapper: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  summaryImage: {
    width: 100,
    height: 100,
  },
  inputSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  reportCard: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  reportDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  reportIndex: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#4CAF50",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reportAddress: {
    fontSize: 14,
    color: "#666",
  },
  reportDate: {
    fontSize: 12,
    color: "#999",
  },
  modalReportId: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ReportStyles;
