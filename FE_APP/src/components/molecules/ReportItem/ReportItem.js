import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReportItem = ({ index, description, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "처리중":
        return "#FF9800"; // 오렌지
      case "접수중":
        return "#2196F3"; // 파랑
      case "처리완료":
        return "#4CAF50"; // 초록
      default:
        return "#757575"; // 회색
    }
  };

  return (
    <View style={styles.reportItem}>
      <Text style={styles.index}>{index}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={[styles.status, { color: getStatusColor(status) }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "10%",
  },
  description: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    marginHorizontal: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ReportItem;
