import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const MainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerBackground: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#6AB5FF",
  },
  hamburgerMenu: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  subGreeting: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  searchBar: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  menuItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    color: "#333",
  },
  quickAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  slideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  moreText: {
    fontSize: 14,
    color: "#039568",
    fontWeight: "bold",
  },
  slideContainer: {
    paddingVertical: 10,
  },
  slideEffect: {
    overflow: "hidden",
  },
});

export default MainStyles;
