import React from "react";
import { TextInput, StyleSheet } from "react-native";

const DetailedInput = ({ value, onChangeText, placeholder }) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      multiline
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
    height: 100,
  },
});

export default DetailedInput;
