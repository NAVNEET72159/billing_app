import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, useWindowDimensions, DeviceEventEmitter } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/CustomerScreen.styles'; 
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';
import AddStaffModal from '../components/AddStaffModal';
import Sidebar from '../components/Sidebar';

export default function StaffScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedStaffId, setExpandedStaffId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        fetchStaff();
        
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme === 'dark') setIsDarkMode(true);
        };
        loadTheme();

        const themeListener = DeviceEventEmitter.addListener('themeChanged', (newTheme) => {
            setIsDarkMode(newTheme === 'dark');
        });

        return () => {
            themeListener.remove();
        };
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

    const handleSuspendToggle = async (user) => {
        const isCurrentlySuspended = user.account_status === 'SUSPENDED';
        const actionWord = isCurrentlySuspended ? 'reactivate' : 'suspend';
        const newStatus = isCurrentlySuspended ? 'ACTIVE' : 'SUSPENDED';
        const warningMsg = `Are you sure you want to ${actionWord} ${user.username}'s account?`;
        
        const executeToggle = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                await axios.put(`${API_URL}/staff/${user.user_id}/suspend`, { newStatus: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
                setStaff(prev => prev.map(s => s.user_id === user.user_id ? { ...s, account_status: newStatus } : s));
            } catch (error) {
                console.error("Toggle Error:", error);
                const msg = "Could not update account status.";
                Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeToggle();
        } else {
            Alert.alert("Confirm Action", warningMsg, [ { text: "Cancel", style: "cancel" }, { text: "Confirm", style: isCurrentlySuspended ? "default" : "destructive", onPress: executeToggle } ]);
        }
    };

    const handleRoleUpdate = async (user) => {
        if (currentUserRole !== 'ADMIN') {
            const msg = "Only Superadmins can modify staff roles.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Permission Denied", msg);
            return;
        }

        const isCurrentlyManager = user.role === 'MANAGER';
        const newRole = isCurrentlyManager ? 'SALESPERSON' : 'MANAGER';
        const actionWord = isCurrentlyManager ? 'demote' : 'promote';
        const warningMsg = `Are you sure you want to ${actionWord} ${user.username} to a ${newRole}?`;

        const executeUpdate = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                await axios.put(`${API_URL}/staff/${user.user_id}/role`, { newRole: newRole }, { headers: { Authorization: `Bearer ${token}` } });
                setStaff(prev => prev.map(s => s.user_id === user.user_id ? { ...s, role: newRole } : s));
            } catch (error) {
                console.error("Role Update Error:", error);
                const msg = "Could not update role.";
                Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeUpdate();
        } else {
            Alert.alert("Confirm Role Change", warningMsg, [ { text: "Cancel", style: "cancel" }, { text: "Confirm", onPress: executeUpdate } ]);
        }
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

    // 🚀 NEW: The dynamic theme object that controls all inner UI components!
    const theme = {
        background: isDarkMode ? '#121212' : '#f4f7f6',
        cardBg: isDarkMode ? '#1e1e1e' : '#ffffff',
        textColor: isDarkMode ? '#ffffff' : '#1a1a1a',
        subText: isDarkMode ? '#aaaaaa' : '#444444',
        borderColor: isDarkMode ? '#333333' : '#f0f0f0',
        actionBg: isDarkMode ? '#2c2c2c' : '#fafafa',
    };

    return (
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: theme.background }}>
            <StatusBar hidden={true} />
            <Sidebar navigation={navigation} currentRoute="Staff" />

            <View style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                
                {Platform.OS === 'web' && (
                    <style type="text/css">{`
                        .hover-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
                        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(245, 124, 0, 0.15) !important; border-color: #F57C00 !important; }
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
                                containerStyle={[styles.searchContainer, { backgroundColor: theme.cardBg, borderColor: theme.borderColor, borderWidth: isDarkMode ? 1 : 0 }]} 
                            />
                        </View>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F57C00" style={{ marginTop: 50 }} />
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
                                    {/* 🚀 FIXED: Injected dynamic card background and border colors */}
                                    <TouchableOpacity 
                                        style={[styles.card, { padding: 20, backgroundColor: theme.cardBg, borderColor: theme.borderColor }, isExpanded && styles.cardExpanded]} 
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
                                                <Text style={{ color: item.role === 'MANAGER' ? '#1976d2' : '#f57c00', fontSize: 18, fontWeight: '900', letterSpacing: 1 }}>
                                                    {getInitials(item.username)}
                                                </Text>
                                            </View>
                                            
                                            <View style={{ flex: 1 }}>
                                                {/* 🚀 FIXED: Injected dynamic text color */}
                                                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.textColor, marginBottom: 4 }} numberOfLines={1}>
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
                                            <View style={{ paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.borderColor }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ width: 28, fontSize: 16, textAlign: 'center' }}>
                                                        {item.account_status === 'ACTIVE' ? '🟢' : '🔴'}
                                                    </Text>
                                                    {/* 🚀 FIXED: Injected dynamic text color */}
                                                    <Text style={{ fontSize: 15, color: theme.textColor, flex: 1, fontWeight: '500' }}>
                                                        Status: {item.account_status}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    {/* 🚀 FIXED: Injected dynamic action-row background and borders */}
                                    {isExpanded && (
                                        <View style={[styles.actionRow, { backgroundColor: theme.actionBg, borderTopColor: theme.borderColor }]}>
                                            <TouchableOpacity 
                                                style={[styles.updateBtn, { borderRightColor: theme.borderColor }]} 
                                                onPress={() => handleRoleUpdate(item)}
                                            >
                                                <Text style={[styles.actionBtnText, { color: theme.textColor }]}>
                                                    {item.role === 'MANAGER' ? '📉 DEMOTE ROLE' : '📈 PROMOTE ROLE'}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={styles.deleteBtn} 
                                                onPress={() => handleSuspendToggle(item)}
                                            >
                                                <Text style={[styles.actionBtnText, { color: item.account_status === 'ACTIVE' ? '#e53935' : '#F57C00' }]}>
                                                    {item.account_status === 'ACTIVE' ? '🚫 SUSPEND' : '✅ REACTIVATE'}
                                                </Text>
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