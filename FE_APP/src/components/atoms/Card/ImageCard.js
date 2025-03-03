import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

const ImageCard = ({ imageSource, label, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
});

export default ImageCard;
