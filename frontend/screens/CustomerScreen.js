import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/CustomerScreen.styles';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';
import AddCustomerModal from '../components/AddCustomerModal';
import UpdateCustomerModal from '../components/UpdateCustomerModal';

export default function CustomerScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data);
        } catch (error) {
            const msg = "Failed to load customers.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async (customer) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/customers/${customer.customer_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(prev => prev.filter(c => c.customer_id !== customer.customer_id));
            const msg = "Customer removed successfully.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Deleted", msg);
        } catch (error) {
            console.error("Delete Error:", error);
            const msg = "Could not delete customer.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        }
    };

    const handleDeleteClick = (customer) => {
        const warningMsg = `Are you sure you want to permanently delete "${customer.customer_name}"?`;
        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeDelete(customer);
        } else {
            Alert.alert(
                "Delete Customer", warningMsg,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "DELETE", style: "destructive", onPress: () => executeDelete(customer) }
                ]
            );
        }
    };

    const handleUpdateClick = (customer) => {
        setSelectedCustomer(customer);
        setUpdateModalVisible(true);
    };

    const toggleExpand = (customerId) => {
        setExpandedCustomerId(prevId => prevId === customerId ? null : customerId);
    };

    const filteredCustomers = (Array.isArray(customers) ? customers : []).filter(c => 
        (c.customer_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (c.phone_number || '').includes(searchText)
    );

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            
            {/* 🚀 WEB-ONLY HOVER ANIMATIONS */}
            {Platform.OS === 'web' && (
                <style type="text/css">{`
                    .hover-card {
                        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    }
                    .hover-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 30px rgba(0, 210, 106, 0.15) !important;
                        border-color: #00D26A !important;
                    }
                    .hover-btn {
                        transition: all 0.2s ease;
                    }
                    .hover-btn:hover {
                        transform: scale(1.05);
                        background-color: #00b359 !important;
                    }
                `}</style>
            )}

            <Header />
            
            {/* 🚀 Sleek Hero Banner */}
            <View style={styles.heroBanner}>
                <View style={styles.heroHeader}>
                    <Text style={styles.pageTitle}>Customers</Text>
                    <Text style={styles.pageSubtitle}>Manage your client directory</Text>
                </View>
                <View style={styles.searchWrapper}>
                    <View style={styles.searchRow}>
                        <SearchBar 
                            placeholder="Search name or phone..." 
                            value={searchText}
                            onChangeText={setSearchText}
                            containerStyle={styles.searchContainer} 
                        />
                        {/* Notice the className applied here for web hovering */}
                        <TouchableOpacity 
                            style={styles.newButton} 
                            onPress={() => setAddModalVisible(true)} 
                            activeOpacity={0.8}
                            className="hover-btn"
                        >
                            <Text style={styles.newButtonText}>+ New</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 🚀 LIST VIEW */}
            {loading ? (
                <ActivityIndicator size="large" color="#00D26A" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredCustomers}
                    keyExtractor={(item, index) => item.customer_id ? item.customer_id.toString() : index.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = item.customer_id === expandedCustomerId;

                        return (
                            <View style={{ marginBottom: 15 }}>
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.9}
                                    onPress={() => toggleExpand(item.customer_id)}
                                    className="hover-card" // 🚀 Injects the CSS hover animation on Web!
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.customerName} numberOfLines={1}>
                                            <Text style={{fontSize: 16}}>👤 </Text>{item.customer_name}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.detailText}>
                                            <Text style={styles.iconText}>📞 </Text>{item.phone_number}
                                        </Text>
                                        
                                        {(item.email || isExpanded) && (
                                            <Text style={styles.detailText} numberOfLines={1}>
                                                <Text style={styles.iconText}>✉️ </Text>{item.email || 'No email provided'}
                                            </Text>
                                        )}
                                        
                                        {(item.current_address || isExpanded) && (
                                            <Text style={styles.detailText} numberOfLines={isExpanded ? 3 : 1}>
                                                <Text style={styles.iconText}>📍 </Text>{item.current_address || 'No address provided'}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                {/* 🚀 EXPANDED ACTION BUTTONS */}
                                {isExpanded && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdateClick(item)}>
                                            <Text style={styles.actionBtnText}>✏️ UPDATE</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteClick(item)}>
                                            <Text style={styles.actionBtnText}>🗑️ DELETE</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
                />
            )}

            <AddCustomerModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddSuccess={fetchCustomers}
            />

            <UpdateCustomerModal 
                visible={isUpdateModalVisible}
                customer={selectedCustomer}
                onClose={() => setUpdateModalVisible(false)}
                onUpdateSuccess={fetchCustomers}
            />
        </View>
    );
}