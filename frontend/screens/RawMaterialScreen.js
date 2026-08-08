import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, FlatList, Modal, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Manufacturing.styles';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';

export default function RawMaterialsScreen({ navigation }) {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [formData, setFormData] = useState({ item_name: '', purchase_rate: '', stock: '' });
    const [updateData, setUpdateData] = useState({ item_name: '', purchase_rate: '', current_stock: 0, add_stock: '' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchRawMaterials();
    }, []);

    const fetchRawMaterials = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/raw-materials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRawMaterials(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            const msg = "Failed to load raw materials.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async () => {
        if (!formData.item_name) {
            Alert.alert("Validation", "Item Name is required.");
            return;
        }
        setFormLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(`${API_URL}/raw-materials`, 
                {
                    item_name: formData.item_name,
                    purchase_rate: parseFloat(formData.purchase_rate) || 0,
                    stock: parseInt(formData.stock) || 0
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Alert.alert("Success", "Raw Material added successfully!");
            setFormData({ item_name: '', purchase_rate: '', stock: '' });
            setAddModalVisible(false);
            fetchRawMaterials();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save raw material.");
        } finally {
            setFormLoading(false);
        }
    };

    const openUpdateModal = (item) => {
        setSelectedMaterial(item);
        setUpdateData({
            item_name: item.item_name,
            purchase_rate: String(item.purchase_rate),
            current_stock: parseInt(item.stock) || 0,
            add_stock: ''
        });
        setUpdateModalVisible(true);
    };

    const handleUpdateSubmit = async () => {
        if (!updateData.item_name) {
            Alert.alert("Validation", "Item Name is required.");
            return;
        }
        setFormLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const finalStock = updateData.current_stock + (parseInt(updateData.add_stock) || 0);

            await axios.put(`${API_URL}/raw-materials/${selectedMaterial.raw_id}`, 
                {
                    item_name: updateData.item_name,
                    purchase_rate: parseFloat(updateData.purchase_rate) || 0,
                    stock: finalStock
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Alert.alert("Success", "Raw Material updated successfully!");
            setUpdateModalVisible(false);
            fetchRawMaterials();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update raw material.");
        } finally {
            setFormLoading(false);
        }
    };

    const executeDelete = async (item) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/raw-materials/${item.raw_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRawMaterials(prev => prev.filter(i => String(i.raw_id) !== String(item.raw_id)));
            const msg = "Raw material removed successfully.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Deleted", msg);
        } catch (error) {
            console.error("Delete Error:", error);
            const msg = "Could not delete the material.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        }
    };

    const handleDeleteClick = (item) => {
        const warningMsg = `Are you sure you want to permanently delete "${item.item_name}"?`;
        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeDelete(item);
        } else {
            Alert.alert("Delete Material", warningMsg, [
                { text: "Cancel", style: "cancel" },
                { text: "DELETE", style: "destructive", onPress: () => executeDelete(item) }
            ]);
        }
    };

    const filteredMaterials = rawMaterials.filter(item => 
        (item.item_name || '').toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Raw Materials</Text>
            </View>

            <View style={styles.searchRow}>
                <SearchBar 
                    placeholder="Search raw materials..." 
                    value={searchText}
                    onChangeText={setSearchText}
                    containerStyle={styles.searchContainer} 
                />
                <TouchableOpacity style={styles.newButton} onPress={() => setAddModalVisible(true)}>
                    <Text style={styles.newButtonText}>New +</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7DBA45" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredMaterials}
                    keyExtractor={(item) => item.raw_id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = item.raw_id === expandedId;
                        return (
                            <View style={{ marginBottom: 12 }}>
                                <TouchableOpacity 
                                    style={[styles.card, isExpanded && styles.cardExpanded]} 
                                    activeOpacity={0.8}
                                    onPress={() => setExpandedId(isExpanded ? null : item.raw_id)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
                                        <Text style={styles.itemDetail}>Purchase Rate: ₹{item.purchase_rate}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.itemStock, { color: item.stock <= 10 ? '#DE3931' : '#7DBA45' }]}>
                                            STOCK: {item.stock}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                
                                {isExpanded && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.updateBtn} onPress={() => openUpdateModal(item)}>
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
                    ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 30}}>No raw materials found.</Text>}
                />
            )}

            <Modal visible={isAddModalVisible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setAddModalVisible(false)}>
                            <Text style={styles.backArrow}>‹</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Add Raw Material</Text>
                        
                        <Text style={[styles.label, {marginTop: 20}]}>Item Name:</Text>
                        <TextInput style={styles.input} value={formData.item_name} onChangeText={(text) => setFormData({...formData, item_name: text})} />

                        <Text style={styles.label}>Purchase Rate (₹):</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(text) => setFormData({...formData, purchase_rate: text})} />

                        <Text style={styles.label}>Initial Stock:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={formData.stock} onChangeText={(text) => setFormData({...formData, stock: text})} />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubmit} disabled={formLoading}>
                                {formLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            <Modal visible={isUpdateModalVisible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setUpdateModalVisible(false)}>
                            <Text style={styles.backArrow}>‹</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Update Material</Text>
                        
                        <Text style={[styles.label, {marginTop: 20}]}>Item Name:</Text>
                        <TextInput style={styles.input} value={updateData.item_name} onChangeText={(text) => setUpdateData({...updateData, item_name: text})} />

                        <Text style={styles.label}>Purchase Rate (₹):</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={updateData.purchase_rate} onChangeText={(text) => setUpdateData({...updateData, purchase_rate: text})} />

                        <Text style={[styles.label, { color: '#7DBA45', fontWeight: 'bold' }]}>Current Stock: {updateData.current_stock}</Text>
                        
                        <Text style={styles.label}>Add New Stock:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 50" value={updateData.add_stock} onChangeText={(text) => setUpdateData({...updateData, add_stock: text})} />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateSubmit} disabled={formLoading}>
                                {formLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setUpdateModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}