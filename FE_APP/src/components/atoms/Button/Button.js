import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AuthColors } from "../../../styles/AuthColors";

const Button = ({ title, onPress, disabled, style, size = 40, textStyle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { height: size },
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AuthColors.buttonColor,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
