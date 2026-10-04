import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/CustomerScreen.styles'; // Reusing your premium layout styles!
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';
// We will build these sidebars next!
import AddStaffModal from '../components/AddStaffModal';
//import UpdateStaffModal from '../components/UpdateStaffModal';

export default function StaffScreen({ navigation }) {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedStaffId, setExpandedStaffId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const role = await AsyncStorage.getItem('userRole'); 
            setCurrentUserRole(role);

            const response = await axios.get(`${API_URL}/staff`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(response.data);
        } catch (error) {
            const msg = "Failed to load staff list.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (userId) => {
        setExpandedStaffId(prevId => prevId === userId ? null : userId);
    };

    const filteredStaff = (Array.isArray(staff) ? staff : []).filter(user => 
        (user.username || '').toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            
            {/* 🚀 WEB-ONLY HOVER ANIMATIONS */}
            {Platform.OS === 'web' && (
                <style type="text/css">{`
                    .hover-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
                    .hover-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0, 210, 106, 0.15) !important; border-color: #00D26A !important; }
                    .role-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
                    .badge-manager { background-color: #2196F3; }
                    .badge-sales { background-color: #FF9800; }
                `}</style>
            )}

            <Header />
            
            <View style={styles.heroBanner}>
                <View style={styles.heroHeader}>
                    <Text style={styles.pageTitle}>Staff Management</Text>
                    <Text style={styles.pageSubtitle}>
                        {currentUserRole === 'ADMIN' ? 'Manage Managers and Salespersons' : 'Manage your Sales Team'}
                    </Text>
                </View>
                <View style={styles.searchWrapper}>
                    <View style={styles.searchRow}>
                        <SearchBar 
                            placeholder="Search username..." 
                            value={searchText}
                            onChangeText={setSearchText}
                            containerStyle={styles.searchContainer} 
                        />
                    </View>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00D26A" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredStaff}
                    keyExtractor={(item) => item.user_id.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = item.user_id === expandedStaffId;
                        const badgeClass = item.role === 'MANAGER' ? 'badge-manager' : 'badge-sales';

                        return (
                            <View style={{ marginBottom: 15 }}>
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.9}
                                    onPress={() => toggleExpand(item.user_id)}
                                    className="hover-card"
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.customerName} numberOfLines={1}>
                                            <Text style={{fontSize: 16}}>🛡️ </Text>{item.username}
                                        </Text>
                                        {Platform.OS === 'web' ? (
                                            <span className={`role-badge ${badgeClass}`}>{item.role}</span>
                                        ) : (
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: item.role === 'MANAGER' ? '#2196F3' : '#FF9800' }}>
                                                {item.role}
                                            </Text>
                                        )}
                                    </View>
                                    
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.detailText}>
                                            <Text style={styles.iconText}>🟢 </Text>Status: {item.account_status}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.updateBtn} onPress={() => {/* handleUpdateClick(item) */}}>
                                            <Text style={styles.actionBtnText}>✏️ UPDATE</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteBtn} onPress={() => {/* handleDeleteClick(item) */}}>
                                            <Text style={styles.actionBtnText}>🗑️ SUSPEND</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No staff members found.</Text>}
                />
            )}

            <View style={styles.floatingCartWrapper}>
                <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.floatingCartBtn} activeOpacity={0.9}>
                    <View style={styles.floatingCartLeft}>
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>+</Text>
                        </View>
                        <Text style={styles.floatingCartTitle}>
                            New {currentUserRole === 'ADMIN' ? 'Manager' : 'Salesperson'}
                        </Text>
                    </View>
                    <Text style={styles.floatingCartTotal}>Add ➔</Text>
                </TouchableOpacity>
            </View>
            <AddStaffModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddSuccess={fetchStaff}
                currentUserRole={currentUserRole}
            />
        </View>
    );
}