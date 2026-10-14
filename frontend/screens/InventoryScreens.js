import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/InventoryScreen.styles';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import UpdateItemModal from '../components/UpdateItemModal';
import AddItemModal from '../components/AddItemModal';
import { API_URL } from '../config/api';
import { getValidImageUrl } from '../components/utils/ImageHelper';
import Sidebar from '../components/Sidebar'; // 🚀 IMPORT THE SIDEBAR

export default function InventoryScreen({ navigation }) {
    // 🚀 Detect if the user is on a desktop computer
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

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
    }, [showArchived]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/items?archived=${showArchived}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            const msg = "Failed to load inventory.";
            Platform.OS !== 'web' ? Alert.alert("Error", msg) : window.alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreClick = async (item) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.put(`${API_URL}/items/${item.item_id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(prev => prev.filter(i => String(i.item_id) !== String(item.item_id)));
            
            const msg = "Item is back in your active inventory!";
            Platform.OS !== 'web' ? Alert.alert("Restored", msg) : window.alert(msg);
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
            setInventory(prev => prev.filter(i => String(i.item_id) !== String(item.item_id)));
            
            const msg = "Item removed successfully.";
            Platform.OS !== 'web' ? Alert.alert("Deleted", msg) : window.alert(msg);
        } catch (error) {
            console.error("Delete Error:", error);
            const msg = "Could not delete the item.";
            Platform.OS !== 'web' ? Alert.alert("Error", msg) : window.alert(msg);
        }
    };

    const handleDeleteClick = async (item) => {
        const warningMsg = `Are you sure you want to permanently delete "${item.item_name}"?`;
        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeDelete(item);
        } else {
            Alert.alert(
                "Delete Item", warningMsg,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "DELETE", style: "destructive", onPress: () => executeDelete(item) }
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
    };

    const filteredInventory = (Array.isArray(inventory) ? inventory : []).filter(item => {
        const search = searchText.toLowerCase();
        return (
            (item.item_name || '').toLowerCase().includes(search) ||
            (item.barcode || '').toLowerCase().includes(search)
        );
    });

    return (
        // 🚀 THE MAGIC LAYOUT WRAPPER
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: '#f4f7f6' }}>
            <StatusBar hidden={true} />
            
            {/* 🚀 THE SIDEBAR */}
            <Sidebar navigation={navigation} currentRoute="Inventory" />

            {/* 🚀 MAIN CONTENT AREA */}
            <View style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                
                {/* WEB-ONLY HOVER ANIMATIONS */}
                {Platform.OS === 'web' && (
                    <style type="text/css">{`
                        .hover-card {
                            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                        }
                        .hover-card:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 15px 30px rgba(245, 124, 0, 0.15) !important;
                            border-color: #F57C00 !important;
                        }
                        .hover-btn {
                            transition: all 0.2s ease;
                        }
                        .hover-btn:hover {
                            transform: scale(1.05);
                        }
                    `}</style>
                )}

                <Header />
            
                {/* Dashboard-Style Hero Banner */}
                <View style={styles.heroBanner}>
                    <View style={styles.heroHeader}>
                        <Text style={styles.pageTitle}>Inventory</Text>
                        <Text style={styles.pageSubtitle}>Manage your products and stock</Text>
                    </View>
                    
                    {/* Sleek Search Row matching New Bill */}
                    <View style={styles.searchWrapper}>
                        <View style={styles.searchRow}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <SearchBar 
                                    placeholder="Search by name or barcode..." 
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    containerStyle={styles.searchContainer} 
                                />
                            </View>
                            <TouchableOpacity 
                                style={[{ 
                                    backgroundColor: showArchived ? '#e53935' : '#1a1a1a', 
                                    paddingHorizontal: 16, 
                                    borderRadius: 12, 
                                    justifyContent: 'center' 
                                }]}
                                onPress={() => setShowArchived(!showArchived)}
                                className="hover-btn"
                            >
                                <Text style={{color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 0.5}}>
                                    {showArchived ? 'VIEW ACTIVE' : 'VIEW ARCHIVED'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F57C00" style={{ marginTop: 50 }} />
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
                            const stockColor = currentStock <= LOW_STOCK_THRESHOLD ? '#e53935' : '#F57C00';
                        
                            return (
                                <View style={{ marginBottom: 15 }}>
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
                
                {!showArchived && (
                    <View style={styles.floatingCartWrapper}>
                        <TouchableOpacity style={styles.floatingCartBtn} onPress={() => setAddModalVisible(true)} activeOpacity={0.9}>
                            <View style={styles.floatingCartLeft}>
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>+</Text>
                                </View>
                                <Text style={styles.floatingCartTitle}>New Item</Text>
                            </View>
                            <Text style={styles.floatingCartTotal}>Add ➔</Text>
                        </TouchableOpacity>
                    </View>
                )}
            
                <UpdateItemModal 
                    visible={isUpdateModalVisible}
                    item={selectedItemForUpdate}
                    onClose={() => setTimeout(() => setUpdateModalVisible(false), 50)} 
                    onUpdateSuccess={fetchInventory} 
                />
                <AddItemModal 
                    visible={isAddModalVisible}
                    onClose={() => setTimeout(() => setAddModalVisible(false), 50)} 
                    onAddSuccess={fetchInventory} 
                />
            </View>
        </View>
    );
}