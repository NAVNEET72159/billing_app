import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/LogBookScreen.styles';
import { API_URL } from '../config/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar'; // 🚀 IMPORT THE SIDEBAR

export default function LogBookScreen({ navigation }) {
    // 🚀 Detect if the user is on a desktop computer
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/raw-material-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
            Alert.alert("Error", "Could not load the log book.");
        } finally {
            setLoading(false);
        }
    };

    const renderLogCard = ({ item }) => {
        const balance = item.stock_start - item.stock_used;
        const displayUnit = item.unit ? ` ${item.unit}` : ''; 

        return (
            <View style={styles.logCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
                    <View style={styles.periodBadge}>
                        <Text style={styles.periodText}>{item.month_name} ({item.financial_year})</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Start Stock</Text>
                        <Text style={styles.statValue}>{item.stock_start}{displayUnit}</Text> 
                    </View>
                    
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Consumed</Text>
                        <Text style={styles.statValueDanger}>- {item.stock_used}{displayUnit}</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Est. Balance</Text>
                        <Text style={[styles.statValue, { color: '#F57C00' }]}>{balance.toFixed(2)}{displayUnit}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        // 🚀 THE MAGIC LAYOUT WRAPPER
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: '#f4f7f6' }}>
            <StatusBar hidden={true} />
            
            {/* 🚀 THE SIDEBAR */}
            <Sidebar navigation={navigation} currentRoute="LogBook" />

            <View style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                <Header />

                {/* 🚀 Sleek Inline Hero Banner */}
                <View style={{
                    backgroundColor: '#F57C00', padding: 20, paddingTop: Platform.OS === 'web' ? 30 : 50,
                    paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
                    marginBottom: 15, shadowColor: '#F57C00', shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.2, shadowRadius: 15, elevation: 10,
                }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 }}>
                        Material Ledger
                    </Text>
                    <Text style={{ fontSize: 15, color: '#FFF3E0', fontWeight: '500', marginTop: 5 }}>
                        Track raw material consumption and balances
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F57C00" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList 
                        data={logs}
                        keyExtractor={(item) => item.log_id.toString()}
                        contentContainerStyle={[styles.listContent, { paddingHorizontal: 20, paddingBottom: 50 }]}
                        renderItem={renderLogCard}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No production logs recorded yet.</Text>
                        }
                    />
                )}
            </View>
        </View>
    );
}