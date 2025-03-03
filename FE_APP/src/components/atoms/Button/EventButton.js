import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AuthColors } from '../../styles/AuthColors';

const EventButton = ({
    title,
    onPress,
    style
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.creat({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: AuthColors.buttonColor,
        borderRadius: 5,
        marginLeft: 10,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
})

export default EventButton;