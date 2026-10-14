import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/CustomerScreen.styles'; 
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';
import AddStaffModal from '../components/AddStaffModal';
import Sidebar from '../components/Sidebar'; // 🚀 IMPORT THE SIDEBAR

export default function StaffScreen({ navigation }) {
    // 🚀 Detect if the user is on a desktop computer
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

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

    const getInitials = (name) => {
        if (!name) return '👤';
        const cleanName = name.replace(/_/g, ' '); 
        const parts = cleanName.trim().split(' ').filter(Boolean);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        // 🚀 THE MAGIC LAYOUT WRAPPER
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: '#f4f7f6' }}>
            <StatusBar hidden={true} />
            
            {/* 🚀 THE SIDEBAR */}
            <Sidebar navigation={navigation} currentRoute="Staff" />

            {/* 🚀 MAIN CONTENT AREA */}
            <View style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                
                {/* WEB-ONLY HOVER ANIMATIONS */}
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
                                        style={[styles.card, { padding: 20 }, isExpanded && styles.cardExpanded]} 
                                        activeOpacity={0.9}
                                        onPress={() => toggleExpand(item.user_id)}
                                        className="hover-card"
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isExpanded ? 18 : 0 }}>
                                            <View style={{ 
                                                width: 54, height: 54, borderRadius: 27, 
                                                backgroundColor: item.role === 'MANAGER' ? '#e3f2fd' : '#fff3e0', 
                                                justifyContent: 'center', alignItems: 'center', 
                                                marginRight: 15, borderWidth: 1, 
                                                borderColor: item.role === 'MANAGER' ? '#bbdefb' : '#ffe0b2' 
                                            }}>
                                                <Text style={{ 
                                                    color: item.role === 'MANAGER' ? '#1976d2' : '#f57c00', 
                                                    fontSize: 18, fontWeight: '900', letterSpacing: 1 
                                                }}>
                                                    {getInitials(item.username)}
                                                </Text>
                                            </View>
                                            
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 }} numberOfLines={1}>
                                                    {item.username}
                                                </Text>
                                                {Platform.OS === 'web' ? (
                                                    <View style={{alignSelf: 'flex-start'}}>
                                                        <span className={`role-badge ${badgeClass}`}>{item.role}</span>
                                                    </View>
                                                ) : (
                                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: item.role === 'MANAGER' ? '#2196F3' : '#FF9800' }}>
                                                        {item.role}
                                                    </Text>
                                                )}
                                            </View>

                                            <View>
                                                <Text style={{ color: '#ccc', fontSize: 16, fontWeight: 'bold' }}>
                                                    {isExpanded ? '▲' : '▼'}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        {isExpanded && (
                                            <View style={{ paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ width: 28, fontSize: 16, textAlign: 'center' }}>
                                                        {item.account_status === 'ACTIVE' ? '🟢' : '🔴'}
                                                    </Text>
                                                    <Text style={{ fontSize: 15, color: '#444', flex: 1, fontWeight: '500' }}>
                                                        Status: {item.account_status}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity style={styles.updateBtn} onPress={() => {/* handleUpdateClick(item) */}}>
                                                <Text style={styles.actionBtnText}>✏️ UPDATE ROLE</Text>
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
                    onClose={() => setTimeout(() => setAddModalVisible(false), 50)}
                    onAddSuccess={fetchStaff}
                    currentUserRole={currentUserRole}
                />
            </View>
        </View>
    );
}