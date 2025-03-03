import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CustomCamera = ({ onImageSelected }) => {
  const [hasPermission, setHasPermission] = useState(null);

  // 카메라 권한 요청
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const takePhoto = async () => {
    // 권한 요청 및 상태 확인
    if (!hasPermission) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        // 권한이 거부된 경우
        return;
      }
    }

    // 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 촬영한 이미지 처리
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={takePhoto}>
      <MaterialIcons name="photo-camera" size={40} color="#4CAF50" />
      <Text style={styles.text}>카메라</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
});

export default CustomCamera;
