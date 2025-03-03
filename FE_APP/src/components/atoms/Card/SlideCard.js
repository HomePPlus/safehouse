import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const SlideCard = ({ imageSource, title, subtitle, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.8,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default SlideCard;
