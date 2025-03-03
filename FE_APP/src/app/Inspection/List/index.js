import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchInspections } from '../../../api/inspectionApi'; // API 함수 호출
import { AuthColors } from '../../../styles/AuthColors';  // 색상 변수
import Footer from '../../../components/molecules/Footer/InspectorFooter'; // Footer

const InspectionListScreen = () => {
  const navigation = useNavigation();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("REGULAR");

  useEffect(() => {
    fetchInspectionList();
  }, [selectedType]);

  const fetchInspectionList = async () => {
    setLoading(true);
    try {
      const data = await fetchInspections(selectedType); // API 호출
      setInspections(data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (inspectionId) => {
    navigation.navigate('Inspection/Detail', { inspectionId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>점검 목록</Text>
      
      {/* 타입 필터 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedType === "REGULAR" && styles.activeFilter]}
          onPress={() => setSelectedType("REGULAR")}
        >
          <Text style={styles.filterText}>정기 점검</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedType === "REPORT" && styles.activeFilter]}
          onPress={() => setSelectedType("REPORT")}
        >
          <Text style={styles.filterText}>신고 점검</Text>
        </TouchableOpacity>
      </View>

      {/* 점검 목록 */}
      {loading ? (
        <ActivityIndicator size="large" color={AuthColors.primary} />
      ) : (
        <FlatList
          data={inspections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item.id)} style={styles.inspectionCard}>
              <Text style={styles.inspectionTitle}>{item.name}</Text>
              <Text style={styles.inspectionDate}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: AuthColors.primary,
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inspectionCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  inspectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inspectionDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default InspectionListScreen;
