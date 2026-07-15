import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/InventoryScreen.styles';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import UpdateItemModal from '../components/UpdateItemModal';
import AddItemModal from '../components/AddItemModal';
import { API_URL } from '../config/api';

export default function InventoryScreen({ navigation }) {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/items`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000
            });
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            Alert.alert("Error", "Failed to load inventory. Check your network.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteClick = (item) => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to permanently delete "${item.item_name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "DELETE", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');
                            await axios.delete(`${API_URL}/items/${item.item_id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });setInventory(prev => prev.filter(i => i.item_id !== item.item_id));
                            Alert.alert("Deleted", "Item removed successfully.");
                        } catch (error) {
                            console.error("Delete Error:", error);
                            Alert.alert("Error", "Could not delete the item.");
                        }
                    } 
                }
            ]
        );
    };
    const handleUpdateClick = (item) => {
        setSelectedItemForUpdate(item);
        setUpdateModalVisible(true);
    };
    const toggleExpand = (itemId) => {
        setExpandedItemId(prevId => prevId === itemId ? null : itemId);
    }
    const filteredInventory = (Array.isArray(inventory) ? inventory : []).filter(item => 
        (item.item_name || '').toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerWrapper}>
                <Header />
            </View>
            
            <Text style={styles.pageTitle}>Inventory</Text>
            <View style={styles.searchRow}>
                <SearchBar 
                    placeholder="Search items by name..." 
                    value={searchText}
                    onChangeText={setSearchText}
                    containerStyle={styles.searchContainer} 
                />
                <TouchableOpacity 
                    style={styles.newButton}
                    onPress={() => setAddModalVisible(true)}
                >
                    <Text style={styles.newButtonText}>New +</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredInventory}
                    keyExtractor={(item, index) => item.item_id ? item.item_id.toString() : index.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = item.item_id === expandedItemId;
                        const LOW_STOCK_THRESHOLD = 10;
                        const currentStock = item.stock || 0;
                        const stockColor = currentStock <= LOW_STOCK_THRESHOLD ? '#e53935' : '#7cb342';
                        return (
                            <View style={{ marginBottom: 12 }}>
                                {/* 🚀 The Card is now clickable! */}
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.8}
                                    onPress={() => toggleExpand(item.item_id)}
                                >
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.cardText} numberOfLines={1}>
                                            <Text style={styles.boldLabel}>Item Name: </Text>{item.item_name}
                                        </Text>
                                        <Text style={styles.cardText}>
                                            <Text style={styles.boldLabel}>Purchase Rate: </Text>₹{item.purchase_rate}
                                        </Text>
                                            <Text style={styles.cardText}>
                                                <Text style={styles.boldLabel}>Sale Rate: </Text>₹{item.sale_rate}
                                            </Text>
                                            <Text style={styles.cardText}>
                                                <Text style={styles.boldLabel}>MRP: </Text>₹{item.mrp}
                                            </Text>
                                    </View>
                                    <View style={styles.rightColumn}>
                                        <View style={styles.imageContainer}>
                                            {item.image_url ? (
                                                <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                                            ) : (
                                                <View style={styles.placeholderImage}><Text style={{fontSize: 24}}>🖼️</Text></View>
                                            )}
                                        </View>
                                        <Text style={[styles.stockText, { color: stockColor }]}>
                                            STOCK: {currentStock}
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
                    ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
                />
            )}
            <UpdateItemModal 
                visible={isUpdateModalVisible}
                item={selectedItemForUpdate}
                onClose={() => setUpdateModalVisible(false)}
                onUpdateSuccess={fetchInventory} // Refresh the list when saving is done
            />
            <AddItemModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddSuccess={fetchInventory} // This ensures the list instantly refreshes after adding!
            />
        </View>
    );
}