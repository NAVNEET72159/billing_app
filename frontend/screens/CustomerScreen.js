import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
            Alert.alert("Error", "Failed to load customers.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteClick = (customer) => {
        Alert.alert(
            "Delete Customer",
            `Are you sure you want to permanently delete "${customer.customer_name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "DELETE", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');
                            await axios.delete(`${API_URL}/customers/${customer.customer_id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            setCustomers(prev => prev.filter(c => c.customer_id !== customer.customer_id));
                            Alert.alert("Deleted", "Customer removed successfully.");
                        } catch (error) {
                            console.error("Delete Error:", error);
                            Alert.alert("Error", "Could not delete customer.");
                        }
                    } 
                }
            ]
        );
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
            <View style={styles.headerWrapper}><Header /></View>
            <Text style={styles.pageTitle}>Update Customer</Text>
            
            <View style={styles.searchRow}>
                <SearchBar 
                    placeholder="Search name or number..." 
                    value={searchText}
                    onChangeText={setSearchText}
                    containerStyle={styles.searchContainer} 
                />
                <TouchableOpacity style={styles.newButton} onPress={() => setAddModalVisible(true)}>
                    <Text style={styles.newButtonText}>New +</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredCustomers}
                    keyExtractor={(item, index) => item.customer_id ? item.customer_id.toString() : index.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = item.customer_id === expandedCustomerId;

                        return (
                            <View style={{ marginBottom: 12 }}>
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.8}
                                    onPress={() => toggleExpand(item.customer_id)}
                                >
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.cardText} numberOfLines={1}>
                                            Customer Name: {item.customer_name}
                                        </Text>
                                        <Text style={styles.cardText}>
                                            Phone Number: {item.phone_number}
                                        </Text>
                                        <Text style={styles.cardText} numberOfLines={1}>
                                            Email: {item.email || 'N/A'}
                                        </Text>
                                        <Text style={styles.cardText} numberOfLines={2}>
                                            Address: {item.current_address || 'N/A'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {isExpanded && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdateClick(item)}>
                                            <Text style={styles.actionBtnText}>UPDATE</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteClick(item)}>
                                            <Text style={styles.actionBtnText}>DELETE</Text>
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