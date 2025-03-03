import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";

const LineChartComponent = () => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>점검 증가 추이</Text>
        <LineChart
            data={{
                labels: ["1월", "2월", "3월", "4월", "5월"],
                datasets: [{ data: [30, 60, 45, 80, 100] }]
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

export default LineChartComponent;
