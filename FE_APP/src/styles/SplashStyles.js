import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const SplashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AuthColors.gradientStart,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: AuthColors.textColor,
  },
});

export default SplashStyles;
