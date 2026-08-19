import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Platform, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import { styles } from '../styles/ReportScreen.styles';
import { API_URL } from '../config/api';

export default function ReportsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Stock');
    const [stockItems, setStockItems] = useState([]);
    const [topSales, setTopSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'Stock') {
            fetchStockItems();
        } else {
            fetchTopSales();
        }
    }, [activeTab]);

    // ==========================================
    // 📦 FETCH LIVE STOCK
    // ==========================================
    const fetchStockItems = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            // Fetch only active items for the report
            const response = await axios.get(`${API_URL}/items?archived=false`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStockItems(response.data);
        } catch (error) {
            console.error("Stock Fetch Error:", error);
            Alert.alert("Error", "Failed to load stock data.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 📈 FETCH TOP SALES
    // ==========================================
    const fetchTopSales = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/reports/monthly-top-items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopSales(response.data);
        } catch (error) {
            console.error("Sales Fetch Error:", error);
            Alert.alert("Error", "Failed to load sales data.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 🖨️ PRINT STOCK REPORT LOGIC
    // ==========================================
    const handlePrintStockReport = async () => {
        if (stockItems.length === 0) return;

        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
                    .header { text-align: center; border-bottom: 2px solid #7DBA45; padding-bottom: 10px; margin-bottom: 20px; }
                    .header h1 { margin: 0; color: #2c2c4d; text-transform: uppercase; letter-spacing: 2px; }
                    .header h3 { margin: 5px 0 0 0; color: #666; }
                    .timestamp { text-align: right; font-size: 12px; color: #888; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                    th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
                    th { background-color: #f4f4f4; color: #2c2c4d; font-weight: bold; }
                    .center-align { text-align: center; }
                    .right-align { text-align: right; }
                    .low-stock { color: #DE3931; font-weight: bold; }
                    .good-stock { color: #7DBA45; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ShanDelay Enterprises</h1>
                    <h3>All Item Stock Report</h3>
                </div>
                
                <div class="timestamp">
                    Generated on: ${new Date().toLocaleString()}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">S.No</th>
                            <th style="width: 20%;">Barcode</th>
                            <th style="width: 45%;">Item Description</th>
                            <th class="right-align" style="width: 15%;">Sale Rate (₹)</th>
                            <th class="center-align" style="width: 15%;">Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stockItems.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.barcode || 'N/A'}</td>
                                <td>${item.item_name}</td>
                                <td class="right-align">${parseFloat(item.sale_rate || 0).toFixed(2)}</td>
                                <td class="center-align ${item.stock <= 10 ? 'low-stock' : 'good-stock'}">
                                    ${item.stock} ${item.unit || ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        try {
            if (Platform.OS === 'web') {
                const printWindow = window.open('', '_blank', 'width=800,height=800');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            } else {
                await Print.printAsync({ html: htmlContent });
            }
        } catch (error) {
            console.error("Print Error:", error);
            Alert.alert("Error", "Could not generate the print document.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Reports</Text>
            </View>

            {/* TAB NAVIGATION */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Stock' && styles.activeTab]} 
                    onPress={() => setActiveTab('Stock')}
                >
                    <Text style={[styles.tabText, activeTab === 'Stock' && styles.activeTabText]}>Live Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Sales' && styles.activeTab]} 
                    onPress={() => setActiveTab('Sales')}
                >
                    <Text style={[styles.tabText, activeTab === 'Sales' && styles.activeTabText]}>Top Sales</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7DBA45" style={{ marginTop: 50 }} />
            ) : (
                <View style={{ flex: 1 }}>
                    {/* ========================================= */}
                    {/* STOCK TAB UI */}
                    {/* ========================================= */}
                    {activeTab === 'Stock' && (
                        <View style={{ flex: 1, paddingHorizontal: 20 }}>
                            <View style={styles.actionRow}>
                                <Text style={styles.sectionSubtitle}>Total Items: {stockItems.length}</Text>
                                <TouchableOpacity style={styles.printBtn} onPress={handlePrintStockReport}>
                                    <Text style={styles.printBtnText}>🖨️ Print Report</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList 
                                data={stockItems}
                                keyExtractor={(item) => item.item_id.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 50 }}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
                                            <Text style={styles.itemDetail}>Barcode: {item.barcode || 'N/A'}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <Text style={[styles.itemStock, { color: item.stock <= 10 ? '#DE3931' : '#7DBA45' }]}>
                                                {item.stock} {item.unit || ''}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyText}>No items found in inventory.</Text>}
                            />
                        </View>
                    )}

                    {/* ========================================= */}
                    {/* SALES TAB UI */}
                    {/* ========================================= */}
                    {activeTab === 'Sales' && (
                        <View style={{ flex: 1, paddingHorizontal: 20 }}>
                            <Text style={[styles.sectionSubtitle, { marginBottom: 15 }]}>Highest Selling Products by Month</Text>
                            <FlatList 
                                data={topSales}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 50 }}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <View style={styles.monthBadge}>
                                            <Text style={styles.monthText}>{item.month}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 15 }}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
                                            <Text style={styles.itemDetail}>Units Sold: <Text style={{fontWeight: 'bold', color: '#2c2c4d'}}>{item.totalSold}</Text></Text>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyText}>No sales data available yet.</Text>}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}