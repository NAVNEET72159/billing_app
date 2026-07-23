import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Platform, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import { styles, chartColors } from '../styles/ReportScreen.styles';
import { API_URL } from '../config/api';

const screenWidth = Dimensions.get('window').width - 40;

export default function ReportScreen({ navigation }) {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedChartType, setSelectedChartType] = useState(null);
    
    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/reports/monthly-top-items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            if (Platform.OS !== 'web') Alert.alert("Error", "Could not load report data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (type) => {
        setSelectedChartType(type);
        setIsDropdownOpen(false);
    };

    const getBarData = () => {
        return {
            labels: reportData.map(d => d.month),
            datasets: [{
                data: reportData.map(d => d.totalSold),
                colors: reportData.map((_, index) => () => chartColors[index % chartColors.length])
            }]
        };
    };

    const getPieData = () => {
        return reportData.map((d, index) => ({
            name: d.itemName,
            population: d.totalSold,
            color: chartColors[index % chartColors.length],
            legendFontColor: "#333",
            legendFontSize: 12
        }));
    };

    const getStackedData = () => {
        return {
            labels: reportData.map(d => d.month),
            legend: ["Sold"],
            data: reportData.map(d => [d.totalSold]),
            barColors: [chartColors[0]]
        };
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.8,
        decimalPlaces: 0,
        propsForBackgroundLines: { strokeWidth: 1, stroke: '#e3e3e3', strokeDasharray: '' },
    };

    return (
        <View style={styles.container}>
            {/* Header matching the design */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Sale Report</Text>
                <Text style={styles.subtitle}>Generate Report Option</Text>

                <TouchableOpacity 
                    style={styles.dropdownBtn} 
                    activeOpacity={0.8}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <Text style={styles.dropdownText}>
                        {selectedChartType ? `Chart: ${selectedChartType}` : "Select Chart Type..."}
                    </Text>
                </TouchableOpacity>
                {isDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectOption('Categorical Chart')}>
                            <Text style={styles.dropdownItemText}>Categorical Chart (Bar)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectOption('Pie Chart')}>
                            <Text style={styles.dropdownItemText}>Pie Chart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectOption('Stacked Chart')}>
                            <Text style={styles.dropdownItemText}>Stacked Chart</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {loading && <ActivityIndicator size="large" color="#4a7bfa" style={{marginTop: 50}}/>}

                {/* Chart Rendering (Initially empty unless an option is selected) */}
                {!loading && selectedChartType && reportData.length > 0 && (
                    <View style={styles.chartContainer}>
                        
                        {selectedChartType === 'Categorical Chart' && (
                            <BarChart
                                data={getBarData()}
                                width={screenWidth}
                                height={280}
                                yAxisLabel=""
                                chartConfig={chartConfig}
                                withCustomBarColorFromData={true}
                                flatColor={true}
                                showValuesOnTopOfBars={true}
                            />
                        )}

                        {selectedChartType === 'Pie Chart' && (
                            <PieChart
                                data={getPieData()}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                absolute
                            />
                        )}

                        {selectedChartType === 'Stacked Chart' && (
                            <StackedBarChart
                                data={getStackedData()}
                                width={screenWidth}
                                height={280}
                                chartConfig={chartConfig}
                                hideLegend={false}
                            />
                        )}
                        
                    </View>
                )}

                {!loading && selectedChartType && reportData.length === 0 && (
                    <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>No sales data available to chart.</Text>
                )}

            </ScrollView>
        </View>
    );
}