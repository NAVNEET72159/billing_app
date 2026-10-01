import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/InventoryScreen.styles';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import UpdateItemModal from '../components/UpdateItemModal';
import AddItemModal from '../components/AddItemModal';
import { API_URL } from '../config/api';
import { getValidImageUrl } from '../components/utils/ImageHelper';

export default function InventoryScreen({ navigation }) {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/items?archived=${showArchived}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000
            });
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            if (Platform.OS !== 'web') {
                Alert.alert("Error", "Failed to load inventory.");
            } else {
                window.alert("Failed to load inventory.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInventory();
    }, [showArchived]);

    const handleRestoreClick = async (item) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.put(`${API_URL}/items/${item.item_id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(prev => prev.filter(i => String(i.item_id) !== String(item.item_id)));
            
            if (Platform.OS !== 'web') {
                Alert.alert("Restored", "Item is back in your active inventory!");
            } else {
                window.alert("Item is back in your active inventory!");
            }
        } catch (error) {
            console.error("Restore Error:", error);
        }
    };

    const executeDelete = async (item) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/items/${item.item_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Immediately remove it from the screen
            setInventory(prev => prev.filter(i => String(i.item_id) !== String(item.item_id)));
            
            if (Platform.OS !== 'web') {
                Alert.alert("Deleted", "Item removed successfully.");
            } else {
                window.alert("Item removed successfully.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            if (Platform.OS !== 'web') {
                Alert.alert("Error", "Could not delete the item.");
            } else {
                window.alert("Could not delete the item.");
            }
        }
    };
    const handleDeleteClick = async (item) => {
        if (Platform.OS === 'web') {
            const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${item.item_name}"?`);
            if (confirmDelete) {
                executeDelete(item);
            }
        }
        else {
            Alert.alert(
                "Delete Item",
                `Are you sure you want to permanently delete "${item.item_name}"?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "DELETE", 
                        style: "destructive", 
                        onPress: () => executeDelete(item)
                    }
                ]
            );
        }
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
                    }
                `}</style>
            )}

            <View style={styles.headerWrapper}>
                <Header />
            </View>
        
            {/* 🚀 Dashboard-Style Hero Banner */}
            <View style={styles.heroBanner}>
                <View style={styles.heroHeader}>
                    <Text style={styles.pageTitle}>Inventory</Text>
                    <Text style={styles.pageSubtitle}>Manage your products and stock</Text>
                </View>
                <View style={styles.searchWrapper}>
                    <View style={styles.searchRow}>
                        <SearchBar 
                            placeholder="Search items by name..." 
                            value={searchText}
                            onChangeText={setSearchText}
                            containerStyle={styles.searchContainer} 
                        />
                        <TouchableOpacity 
                            style={[styles.newButton, { backgroundColor: showArchived ? '#e53935' : '#1a1a1a', marginRight: 10 }]}
                            onPress={() => setShowArchived(!showArchived)}
                            className="hover-btn"
                        >
                            <Text style={styles.newButtonText}>{showArchived ? 'Active' : 'Archived'}</Text>
                        </TouchableOpacity>
                        {!showArchived && (
                            <TouchableOpacity 
                                style={[styles.newButton, { backgroundColor: '#00D26A' }]}
                                onPress={() => setAddModalVisible(true)}
                                className="hover-btn"
                            >
                                <Text style={styles.newButtonText}>+ New</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00D26A" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredInventory}
                    keyExtractor={(item, index) => item.item_id ? item.item_id.toString() : index.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false} /* 🚀 Vertical scroll intact */
                    renderItem={({ item }) => {
                        const isExpanded = item.item_id === expandedItemId;
                        const LOW_STOCK_THRESHOLD = 10;
                        const currentStock = item.stock || 0;
                        const stockColor = currentStock <= LOW_STOCK_THRESHOLD ? '#e53935' : '#00D26A';
                    
                        return (
                            <View style={{ marginBottom: 15 }}>
                                {/* 🚀 Upgraded Attractive Card */}
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.9}
                                    onPress={() => toggleExpand(item.item_id)}
                                    className="hover-card"
                                >
                                    <View style={styles.cardContentWrapper}>
                                        <View style={styles.cardLeft}>
                                            <Text style={styles.itemName} numberOfLines={1}>
                                                <Text style={{fontSize: 18}}>📦 </Text>{item.item_name}
                                            </Text>
                                        
                                            <View style={styles.priceGrid}>
                                                <View style={styles.priceColumn}>
                                                    <Text style={styles.priceLabel}>Purchase</Text>
                                                    <Text style={styles.priceValue}>₹{item.purchase_rate}</Text>
                                                </View>
                                                <View style={styles.priceColumn}>
                                                    <Text style={styles.priceLabel}>Sale</Text>
                                                    <Text style={styles.priceValue}>₹{item.sale_rate}</Text>
                                                </View>
                                                <View style={styles.priceColumn}>
                                                    <Text style={styles.priceLabel}>MRP</Text>
                                                    <Text style={styles.priceValue}>₹{item.mrp}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.cardRight}>
                                            <View style={styles.imageContainer}>
                                                {item.image_url ? (
                                                    <Image source={{ uri: getValidImageUrl(item.image_url) }} style={styles.itemImage} />
                                                ) : (
                                                    <View style={styles.placeholderImage}><Text style={{fontSize: 24}}>🖼️</Text></View>
                                                )}
                                            </View>
                                            <View style={[styles.stockBadge, { backgroundColor: stockColor + '1A' }]}>
                                                <Text style={[styles.stockText, { color: stockColor }]}>
                                                    {currentStock} in stock
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Expanded Actions */}
                                {isExpanded && (
                                    <View style={styles.actionRow}>
                                        {!showArchived ? (
                                            <>
                                                <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdateClick(item)}>
                                                    <Text style={styles.actionBtnText}>✏️ UPDATE</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteClick(item)}>
                                                    <Text style={styles.actionBtnText}>🗑️ DELETE</Text>
                                                </TouchableOpacity>
                                            </>
                                        ):(
                                            <TouchableOpacity style={[styles.updateBtn, { backgroundColor: '#1976d2' }]} onPress={() => handleRestoreClick(item)}>
                                                <Text style={styles.actionBtnText}>🔄 RESTORE ITEM</Text>
                                            </TouchableOpacity>
                                        )}  
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
                onUpdateSuccess={fetchInventory} 
            />
            <AddItemModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddSuccess={fetchInventory} 
            />
        </View>
    );
}