import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const CommunityStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: "#039568",
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
      },
      headerIcons: {
        flexDirection: "row",
      },
      listContainer: {
        paddingHorizontal: 16,
      },
      postCard: {
        backgroundColor: "#FFF",
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      postTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
      },
      postMeta: {
        fontSize: 12,
        color: "#666",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      },
      modalContent: {
        width: "80%",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 20,
      },
      filterContent: {
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
      },
      modalButton: {
        backgroundColor: "#039568",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 10,
      },
      filterButtonContainer: {
        flexDirection: "row", // 버튼을 가로로 배치
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
      },
      applyButton: {
        flex: 1,
        backgroundColor: "#4CAF50", // 녹색 (적용 버튼)
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
      },
      resetButton: {
        flex: 1,
        backgroundColor: "#E0E0E0", // 회색 (초기화 버튼)
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
      },
      buttonText: {
        color: "#FFFFFF", // 버튼 텍스트 색상 (적용 버튼: 흰색)
        fontSize: 16,
        fontWeight: "bold",
      },
      
      searchInput: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        borderWidth: 1,
        borderColor: "#DDD",
        marginBottom: 16,
      },
      filterOption: {
        width: "90%",
      },
      floatingButton: {
        position: "absolute",
        bottom: 80,
        right: 16,
        backgroundColor: "#039568",
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      },
      filterLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 10,
      },
      filterOption: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#DDD",
      },
      selectedOption: {
        backgroundColor: "#039568",
        borderColor: "#039568",
      },
      filterOptionText: {
        color: "#333",
      },
});

export default CommunityStyles;
