import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import BarChartComponent from '../../atoms/Graph/barChart'; // ✅ 가져오기
import LineChartComponent from '../../atoms/Graph/lineChart'; // ✅ 가져오기

const DashboardStats = () => (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>점검 현황</Text>
        <BarChartComponent />
        <LineChartComponent />
    </ScrollView>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default DashboardStats;
