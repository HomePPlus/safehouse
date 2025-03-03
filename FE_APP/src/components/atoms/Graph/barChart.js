import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit";

const BarChartComponent = () => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>지역별 점검 수</Text>
        <BarChart
            data={{
                labels: ["서울", "부산", "대구", "인천"],
                datasets: [{ data: [20, 40, 30, 50] }]
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
        />
    </View>
);

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
};

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", padding: 15, marginVertical: 10, borderRadius: 10, elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    chart: { borderRadius: 10 },
});

export default BarChartComponent;
