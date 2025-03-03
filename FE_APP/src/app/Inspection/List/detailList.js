import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchInspectionDetail } from '../../../api/inspectionApi'; // API 함수 호출
import { AuthColors } from '../../../styles/AuthColors';  // 색상 변수

const InspectionDetailScreen = () => {
  const navigation = useNavigation();
  const { inspectionId } = useRoute().params; // 점검 ID 파라미터
  const [inspectionDetail, setInspectionDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInspectionDetail = async () => {
      try {
        const data = await fetchInspectionDetail(inspectionId); // API 호출
        setInspectionDetail(data);
      } catch (error) {
        console.error('Error fetching inspection detail:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInspectionDetail();
  }, [inspectionId]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>◀️ 돌아가기</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={AuthColors.primary} />
      ) : (
        <ScrollView>
          <Text style={styles.title}>{inspectionDetail?.name}</Text>
          <Text style={styles.date}>{inspectionDetail?.date}</Text>

          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>상세 정보</Text>
            <Text style={styles.cardContent}>{inspectionDetail?.description}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>점검 상태</Text>
            <Text style={styles.cardContent}>{inspectionDetail?.status}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AuthColors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
  },
  detailCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default InspectionDetailScreen;
