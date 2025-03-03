import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { AuthColors } from "../../../styles/AuthColors";
import { useNavigation } from '@react-navigation/native';

const Header = ({ 
  title, 
  onBackPress, 
  logoSource, 
  backButtonSource,
  style,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={onBackPress || navigation.goBack}>
        <Image 
          source={backButtonSource} 
          style={styles.backButton} 
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Image 
        source={logoSource} 
        style={styles.logo} 
      />
    </View>
  );
};


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,

  },
  backButton: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
  },
});

export default Header;
