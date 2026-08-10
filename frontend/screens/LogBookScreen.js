import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/LogBookScreen.styles';
import { API_URL } from '../config/api';

export default function LogBookScreen({ navigation }) {
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
        const displayUnit = item.unit ? ` ${item.unit}` : ''; // 🚀 Safely format the unit

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
                        <Text style={[styles.statValue, { color: '#7DBA45' }]}>{balance.toFixed(2)}{displayUnit}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Standard Navigation Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Material Ledger</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#7DBA45" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={logs}
                    keyExtractor={(item) => item.log_id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderLogCard}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No production logs recorded yet.</Text>
                    }
                />
            )}
        </View>
    );
}