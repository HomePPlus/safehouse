import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const FilterModal = ({ visible, onClose, onApply }) => {
  const [selectedFilter, setSelectedFilter] = useState("전체");

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>필터 선택</Text>
          {["전체", "처리 중", "접수 중", "처리 완료"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterOption,
                selectedFilter === filter && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              onApply(selectedFilter);
              onClose();
            }}
          >
            <Text style={styles.applyButtonText}>적용</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#039568",
    textAlign: "center",
  },
  filterOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF", // 버튼 배경 흰색
  },
  selectedOption: {
    backgroundColor: "#E0F7FA",
  },
  filterText: {
    fontSize: 16,
    color: "#039568", // 텍스트 초록색
  },
  selectedText: {
    fontWeight: "bold",
    color: "#039568",
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: "#FFF", // 버튼 배경 흰색
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  applyButtonText: {
    color: "#039568", // 텍스트 초록색
    fontSize: 16,
    fontWeight: "bold",
  },
});
