import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Platform, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print'; 
import { styles } from '../styles/ReportScreen.styles';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown'; 

export default function ReportsScreen({ navigation }) {
    // 🚀 NEW: Added FYLedger tab
    const [activeTab, setActiveTab] = useState('Stock'); 
    
    const [stockItems, setStockItems] = useState([]);
    const [topSales, setTopSales] = useState([]);
    const [fyLedger, setFyLedger] = useState([]);
    const [loading, setLoading] = useState(true);

    const [itemGroups, setItemGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState('All Groups');

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (activeTab === 'Stock') fetchStockItems();
        else if (activeTab === 'Sales') fetchTopSales();
        else if (activeTab === 'FYLedger') fetchFyLedger();
    }, [activeTab]);

    const fetchGroups = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const groupRes = await axios.get(`${API_URL}/groups`, { headers: { Authorization: `Bearer ${token}` } });
            const groups = [{ id: null, name: 'All Groups' }, ...groupRes.data.map(g => ({ id: g.item_group_id, name: g.group_name }))];
            setItemGroups(groups);
        } catch (error) {
            console.error("Fetch Groups Error:", error);
        }
    };

    const fetchStockItems = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/items?archived=false`, { headers: { Authorization: `Bearer ${token}` } });
            setStockItems(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load stock data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTopSales = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/reports/monthly-top-items`, { headers: { Authorization: `Bearer ${token}` } });
            setTopSales(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load sales data.");
        } finally {
            setLoading(false);
        }
    };

    // 🚀 NEW: Fetch Yearly Ledger Data
    const fetchFyLedger = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/reports/fy-ledger`, { headers: { Authorization: `Bearer ${token}` } });
            setFyLedger(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load FY Ledger data.");
        } finally {
            setLoading(false);
        }
    };

    // 🚀 NEW: Trigger the Snapshot
    const handleTakeSnapshot = async () => {
        const warningMsg = "Record closing stock for this Financial Year?\n\nThis permanently saves this year's ledger. If you make more sales and click this again before next April, it will simply update the final numbers for this current year.";
        
        const executeSnapshot = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.post(`${API_URL}/reports/fy-snapshot`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Platform.OS === 'web' ? window.alert(response.data.message) : Alert.alert("Success", response.data.message);
                fetchFyLedger(); 
            } catch (error) {
                console.error("Snapshot Error:", error);
                Platform.OS === 'web' ? window.alert("Failed to capture snapshot.") : Alert.alert("Error", "Failed to capture snapshot.");
            } finally {
                setLoading(false);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeSnapshot();
        } else {
            Alert.alert("FY Stock Snapshot", warningMsg, [
                { text: "Cancel", style: "cancel" },
                { text: "Take Snapshot", onPress: executeSnapshot }
            ]);
        }
    };

    const filteredStockItems = selectedGroupId 
        ? stockItems.filter(item => String(item.item_group_id) === String(selectedGroupId))
        : stockItems;

    const handlePrintStockReport = async () => {
        if (filteredStockItems.length === 0) {
            Alert.alert("Empty Report", "There are no items in this group to print.");
            return;
        }

        const reportTitle = selectedGroupId ? `${selectedGroupName} - Stock Report` : `All Item Stock Report`;
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
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>PYSSUM</h1>
                    <h3>${reportTitle}</h3> 
                </div>
                <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
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
                        ${filteredStockItems.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.barcode || 'N/A'}</td>
                                <td>${item.item_name}</td>
                                <td class="right-align">${parseFloat(item.sale_rate || 0).toFixed(2)}</td>
                                <td class="center-align">${item.stock} ${item.unit || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        try {
            if (Platform.OS === 'web') {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
            } else {
                await Print.printAsync({ html: htmlContent });
            }
        } catch (error) {
            console.error("Print Error:", error);
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
                <TouchableOpacity style={[styles.tab, activeTab === 'Stock' && styles.activeTab]} onPress={() => setActiveTab('Stock')}>
                    <Text style={[styles.tabText, activeTab === 'Stock' && styles.activeTabText]}>Live Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'Sales' && styles.activeTab]} onPress={() => setActiveTab('Sales')}>
                    <Text style={[styles.tabText, activeTab === 'Sales' && styles.activeTabText]}>Top Sales</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'FYLedger' && styles.activeTab]} onPress={() => setActiveTab('FYLedger')}>
                    <Text style={[styles.tabText, activeTab === 'FYLedger' && styles.activeTabText]}>FY Ledger</Text>
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
                            <View style={{ marginBottom: 15, zIndex: 10 }}>
                                <Text style={[styles.sectionSubtitle, { marginBottom: 5 }]}>Filter by Group:</Text>
                                <CustomDropdown
                                    data={itemGroups}
                                    value={selectedGroupName}
                                    placeholder="Select Group..."
                                    onSelect={(item) => { setSelectedGroupId(item.id); setSelectedGroupName(item.name); }}
                                />
                            </View>
                            <View style={styles.actionRow}>
                                <Text style={styles.sectionSubtitle}>Total Items: {filteredStockItems.length}</Text>
                                <TouchableOpacity style={styles.printBtn} onPress={handlePrintStockReport}>
                                    <Text style={styles.printBtnText}>🖨️ Print Report</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList 
                                data={filteredStockItems}
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
                                ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
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

                    {/* ========================================= */}
                    {/* 🚀 NEW: FY LEDGER TAB UI */}
                    {/* ========================================= */}
                    {activeTab === 'FYLedger' && (
                        <View style={{ flex: 1, paddingHorizontal: 20 }}>
                            <View style={[styles.actionRow, { justifyContent: 'flex-end', marginBottom: 15 }]}>
                                <TouchableOpacity style={[styles.printBtn, { backgroundColor: '#1565c0' }]} onPress={handleTakeSnapshot}>
                                    <Text style={styles.printBtnText}>📸 Capture FY Snapshot</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList 
                                data={fyLedger}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 50 }}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <View style={styles.monthBadge}>
                                            <Text style={[styles.monthText, {fontSize: 12}]}>{item.financial_year}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 15 }}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
                                            <Text style={styles.itemDetail}>Captured: {new Date(item.snapshot_date).toLocaleDateString()}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <Text style={styles.itemStock}>
                                                {item.closing_stock} {item.unit || ''}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyText}>No FY snapshots taken yet.</Text>}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}