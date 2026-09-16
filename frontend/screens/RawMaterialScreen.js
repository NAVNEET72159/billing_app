import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, FlatList, Modal, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Manufacturing.styles';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown';
import CreateGroupModal from '../components/CreateGroupModal';

export default function RawMaterialsScreen({ navigation }) {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    
    // Category / Group States
    const [itemGroups, setItemGroups] = useState([]);
    const [isGroupModalVisible, setGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
    
    const [formData, setFormData] = useState({ barcode: '', item_name: '', category: '', purchase_rate: '', stock: '', unit: '' });
    const [updateData, setUpdateData] = useState({ barcode: '', item_name: '', category: '', purchase_rate: '', current_stock: 0, add_stock: '', unit: '' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchRawMaterials();
        fetchGroups();
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

    const fetchGroups = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/groups`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formattedGroups = response.data.map(group => ({
                id: group.item_group_id,
                name: group.group_name 
            }));
            setItemGroups(formattedGroups);
        } catch (error) {
            console.error("Groups Fetch Error:", error);
        }
    };

    const handleCreateNewGroup = () => {
        setGroupModalVisible(true);
    };

    const submitNewGroup = async () => {
        if (!newGroupName.trim()) {
            Alert.alert("Error", "Please enter a name for the category.");
            return;
        }

        setIsSubmittingGroup(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(`${API_URL}/item-groups`, 
                { group_name: newGroupName }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newGroupObj = { 
                name: response.data.group_name, 
                id: response.data.item_group_id 
            };
            setItemGroups(prev => [...prev, newGroupObj]);
            
            // 🚀 FIXED: Auto-select the newly created category in the forms
            setFormData(prev => ({ ...prev, category: newGroupObj.name }));
            setUpdateData(prev => ({ ...prev, category: newGroupObj.name }));
            
            setGroupModalVisible(false);
            setNewGroupName('');
        } catch (error) {
            console.error("Submit Group Error:", error);
            const errMsg = error.response ? error.response.data.error : "Failed to create category.";
            Alert.alert("Error", errMsg);
        } finally {
            setIsSubmittingGroup(false);
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
                    barcode: formData.barcode,
                    item_name: formData.item_name,
                    category: formData.category, // Maps perfectly to DB
                    purchase_rate: parseFloat(formData.purchase_rate) || 0,
                    stock: parseInt(formData.stock) || 0,
                    unit: formData.unit 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Alert.alert("Success", "Raw Material added successfully!");
            setFormData({ barcode: '', item_name: '', category: '', purchase_rate: '', stock: '', unit: '' });
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
            barcode: item.barcode || '', 
            item_name: item.item_name,
            category: item.category || '', 
            purchase_rate: String(item.purchase_rate),
            current_stock: parseInt(item.stock) || 0,
            add_stock: '',
            unit: item.unit || '' 
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
                    barcode: updateData.barcode, 
                    item_name: updateData.item_name,
                    category: updateData.category, 
                    purchase_rate: parseFloat(updateData.purchase_rate) || 0,
                    stock: finalStock,
                    unit: updateData.unit 
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

    const filteredMaterials = rawMaterials.filter(item => {
        const search = searchText.toLowerCase();
        return (
            (item.item_name || '').toLowerCase().includes(search) ||
            (item.barcode || '').toLowerCase().includes(search) ||
            (item.category || '').toLowerCase().includes(search) ||
            String(item.raw_id).includes(search)
        );
    });

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
                    placeholder="Search by name, category, barcode..." 
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
                                        <Text style={[styles.itemDetail, { color: '#2c2c4d', fontWeight: 'bold' }]}>
                                            ID: {item.raw_id}  |  Barcode: {item.barcode || 'N/A'}
                                        </Text>
                                        <Text style={styles.itemDetail}>Category: {item.category || 'Uncategorized'}</Text>
                                        <Text style={styles.itemDetail}>Purchase Rate: ₹{item.purchase_rate}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.itemStock, { color: item.stock <= 10 ? '#DE3931' : '#7DBA45' }]}>
                                            STOCK: {item.stock} {item.unit || ''}
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

            {/* ADD MODAL */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setAddModalVisible(false)}>
                            <Text style={styles.backArrow}>‹</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Add Raw Material</Text>

                        <Text style={[styles.label, {marginTop: 20}]}>Barcode (Optional):</Text>
                        <TextInput style={styles.input} placeholder="Scan or type barcode" value={formData.barcode} onChangeText={(text) => setFormData({...formData, barcode: text})} />
                        
                        <Text style={styles.label}>Item Name:</Text>
                        <TextInput style={styles.input} value={formData.item_name} onChangeText={(text) => setFormData({...formData, item_name: text})} />

                        {/* 🚀 FIXED: Directly tied to category value */}
                        <Text style={styles.label}>Category:</Text>
                        <CustomDropdown
                            data={itemGroups}
                            value={formData.category}
                            placeholder="Select a Category..."
                            onSelect={(selectedItem) => {
                                setFormData({...formData, category: selectedItem.name});
                            }}
                            onCreateNew={handleCreateNewGroup}
                        />

                        <Text style={styles.label}>Purchase Rate (₹):</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(text) => setFormData({...formData, purchase_rate: text})} />

                        <Text style={styles.label}>Initial Stock:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={formData.stock} onChangeText={(text) => setFormData({...formData, stock: text})} />

                        <Text style={styles.label}>Unit:</Text>
                        <CustomDropdown
                            data={['Pks', 'Pcs', 'Kg', 'g', 'm', 'cm', 'L', 'ml']}
                            value={formData.unit}
                            placeholder="Select a unit..."
                            onSelect={(selectedItem) => setFormData({...formData, unit: selectedItem})}
                            onCreateNew={() => {
                                if (typeof window !== 'undefined' && window.prompt) {
                                    const customUnit = window.prompt("Enter a new custom unit (e.g., Box, Dozen):");
                                    if (customUnit) setFormData({...formData, unit: customUnit});
                                } else Alert.alert("New Unit", "Custom units can be added here.");
                            }}
                        />

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

            {/* UPDATE MODAL */}
            <Modal visible={isUpdateModalVisible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setUpdateModalVisible(false)}>
                            <Text style={styles.backArrow}>‹</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Update Material</Text>

                        <Text style={[styles.label, {marginTop: 20}]}>Barcode (Optional):</Text>
                        <TextInput style={styles.input} placeholder="Scan or type barcode" value={updateData.barcode} onChangeText={(text) => setUpdateData({...updateData, barcode: text})} />
                        
                        <Text style={styles.label}>Item Name:</Text>
                        <TextInput style={styles.input} value={updateData.item_name} onChangeText={(text) => setUpdateData({...updateData, item_name: text})} />

                        {/* 🚀 FIXED: Directly tied to category value */}
                        <Text style={styles.label}>Category:</Text>
                        <CustomDropdown
                            data={itemGroups}
                            value={updateData.category}
                            placeholder="Select a Category..."
                            onSelect={(selectedItem) => {
                                setUpdateData({...updateData, category: selectedItem.name});
                            }}
                            onCreateNew={handleCreateNewGroup}
                        />

                        <Text style={styles.label}>Purchase Rate (₹):</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={updateData.purchase_rate} onChangeText={(text) => setUpdateData({...updateData, purchase_rate: text})} />

                        <Text style={[styles.label, { color: '#7DBA45', fontWeight: 'bold' }]}>Current Stock: {updateData.current_stock} {updateData.unit || ''}</Text>
                        
                        <Text style={styles.label}>Add New Stock:</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 50" value={updateData.add_stock} onChangeText={(text) => setUpdateData({...updateData, add_stock: text})} />

                        <Text style={styles.label}>Unit:</Text>
                        <CustomDropdown
                            data={['Pks', 'Pcs', 'Kg', 'g', 'm', 'cm', 'L', 'ml']}
                            value={updateData.unit}
                            placeholder="Select a unit..."
                            onSelect={(selectedItem) => setUpdateData({...updateData, unit: selectedItem})}
                            onCreateNew={() => {
                                if (typeof window !== 'undefined' && window.prompt) {
                                    const customUnit = window.prompt("Enter a new custom unit (e.g., Box, Dozen):");
                                    if (customUnit) setUpdateData({...updateData, unit: customUnit});
                                } else Alert.alert("New Unit", "Custom units can be added here.");
                            }}
                        />

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

            {/* 🚀 NEW: CREATE GROUP MODAL */}
            <CreateGroupModal 
                visible={isGroupModalVisible}
                onClose={() => setGroupModalVisible(false)}
                onSuccess={(newGroupObj) => {
                    // Instantly updates dropdown list AND form selection
                    setItemGroups(prev => [...prev, newGroupObj]);
                    setFormData({ ...formData, item_group_id: newGroupObj.id, item_group_name: newGroupObj.name });
                }}
            />
        </View>
    );
}