import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const PostStyles = StyleSheet.create({
  // post.js
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: "#222222",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555555",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#197E34",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // postDetail.js
  detailContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  metaInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: "#6C757D",
    marginLeft: 5,
  },

  // 글 내용 박스
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    width: "90%",
    height: "60%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    marginLeft: 15,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  commentSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
    marginLeft: 25,
  },
  commentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    marginBottom: 10,
  },
  commentIcon: {
    marginRight: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#555",
  },
  noComments: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  // 댓글 입력 창
  commentInput: {
    flex: 0.9,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    marginLeft: 15,
    marginRight: 10,
  },
  
  commentButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12, // 기존 20 → 12
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8, // 기존 10 → 8
    paddingHorizontal: 16, // 기존 20 → 16
    borderRadius: 8, // 기존 12 → 8
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export default PostStyles;
