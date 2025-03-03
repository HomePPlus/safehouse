import { StyleSheet } from "react-native";
import { AuthColors } from "./AuthColors";

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: AuthColors.buttonColor,
  },
  userTypeText: {
    color: "#000",
    fontWeight: "bold",
  },
  button: {
    width: "30%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: AuthColors.buttonColor,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  linkText: {
    marginHorizontal: 10,
    color: AuthColors.textColor,
    textDecorationLine: "underline",
  },
  mascot: {
    width: 80,
    height: 80,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default LoginStyles;
