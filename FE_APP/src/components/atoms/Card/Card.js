import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // 아이콘 라이브러리
import { AuthColors } from "../../../styles/AuthColors";

const Card = ({
  iconName,
  title,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        style,
      ]}
      onPress={onPress}
    >
      <MaterialIcons
        name={iconName}
        size={24}
        color={isSelected ? AuthColors.buttonColor : "#ccc"} // 선택 상태에 따라 색상 변경
      />
      <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "20%", // 각 버튼의 크기 설정
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderTopWidth: 2,
    borderColor: AuthColors.buttonColor, // 선택된 카드에 상단 경계선 추가
  },
  cardTitle: {
    fontSize: 12,
    color: "#ccc", // 기본 텍스트 색상
    marginTop: 5,
  },
  selectedText: {
    color: AuthColors.buttonColor, // 선택된 텍스트 색상
  },
});

export default Card;
