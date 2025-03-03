import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Input from '../../../components/atoms/Input/Input';
import Postcode from '@actbase/react-daum-postcode';
import { AuthColors } from '../../../styles/AuthColors';

const Address = ({ 
    address,
    setAddress,
    detailedAddress,
    setDetailedAddress
}) => {
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false); // Postcode 모달 표시 여부

  const handleFindAddress = () => {
    setIsPostcodeVisible(true); // Postcode 모달 열기
  };

  const handleAddressSelect = (data) => {
    setAddress(data.address); // 선택된 주소 설정
    setIsPostcodeVisible(false); // Postcode 모달 닫기
  };

  return (
    <View>
      {/* 주소 필드 */}
      <View style={styles.addressContainer}>
        <Input
          style={[styles.input, { flex: 1 }]}
          value={address}
          editable={false}
          placeholder="주소"
        />
        <TouchableOpacity
          style={styles.addressButton}
          onPress={handleFindAddress}
        >
          <Text style={styles.addressButtonText}>주소 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 상세 주소 필드 */}
      <Input
        style={styles.input}
        value={detailedAddress}
        onChangeText={setDetailedAddress}
        placeholder="상세 주소 입력해 주세요"
      />

      {/* 주소 검색 모달 */}
      <Modal
        visible={isPostcodeVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Postcode
            style={styles.postcode}
            jsOptions={{ animation: true }}
            onSelected={(data) => handleAddressSelect(data)}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsPostcodeVisible(false)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressButton: {
    backgroundColor: AuthColors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  addressButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postcode: {
    width: '90%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: AuthColors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Address;
