import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/AddItemModal.styles';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown';
import * as ImagePicker from 'expo-image-picker';

export default function AddItemModal({ visible, onClose, onAddSuccess, initialBarcode }) {
    const [isGroupModalVisible, setGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
    const [formData, setFormData] = useState({
        barcode: '', item_name: '', item_group_id: '', item_group_name: '', gst_percentage: '',
        mrp: '', purchase_rate: '', sale_rate: '', stock: '', unit: ''
    });
    const [loading, setLoading] = useState(false);
    const [itemGroups, setItemGroups] = useState([]);
    
    // Image State
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "You need to allow camera roll permissions to upload product photos.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, 
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchGroups();
            setFormData(prevData => ({
                ...prevData,
                barcode: initialBarcode || ''
            }));
        }
    }, [visible, initialBarcode]);

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
            console.error("Groups Fetch Error:", error.response ? error.response.data : error.message);
        }
    };

    const handleCreateNewGroup = () => {
        setGroupModalVisible(true);
    };

    const submitNewGroup = async () => {
        if (!newGroupName.trim()) {
            Alert.alert("Error", "Please enter a name for the group.");
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
            setFormData({ ...formData, item_group_id: newGroupObj.id, item_group_name: newGroupObj.name });
            Alert.alert("Success", "Item Group created!");
            setGroupModalVisible(false);
            setNewGroupName('');
        } catch (error) {
            console.error("Submit Group Error:", error);
            const errMsg = error.response ? error.response.data.error : "Failed to create group.";
            Alert.alert("Error", errMsg);
        } finally {
            setIsSubmittingGroup(false);
        }
    };

    const handleSave = async () => {
        if (!formData.item_name) {
            Alert.alert("Validation", "Item name is required.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            let finalImageUrl = null;

            // 🚀 FIXED: Cross-Platform Image Upload (Web + Mobile compatibility)
            if (imageUri) {
                const imgData = new FormData();

                if (Platform.OS === 'web') {
                    // Web needs a Blob object
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    imgData.append('image', blob, `photo-${Date.now()}.jpg`);
                } else {
                    // Mobile needs the URI object
                    imgData.append('image', {
                        uri: imageUri,
                        name: `photo-${Date.now()}.jpg`,
                        type: 'image/jpeg',
                    });
                }

                const uploadRes = await axios.post(`${API_URL}/upload-image`, imgData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data.image_url;
            }

            // 🚀 FIXED: Ensure empty values are parsed correctly so MySQL doesn't crash
            const payload = {
                ...formData,
                item_group_id: formData.item_group_id ? parseInt(formData.item_group_id) : null,
                gst_percentage: parseFloat(formData.gst_percentage) || 0,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                stock: parseInt(formData.stock) || 0,
                image_url: finalImageUrl 
            };

            await axios.post(`${API_URL}/items`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Item added successfully!");

            // Reset the form and image preview
            setFormData({ barcode: '', item_name: '', item_group_id: '', item_group_name: '', gst_percentage: '', mrp: '', purchase_rate: '', sale_rate: '', stock: '', unit: '' });
            setImageUri(null);
            
            onAddSuccess(); 
            onClose(); 
        } catch (error) {
            console.error("Add Error:", error);
            // 🚀 FIXED: Extract the actual error message from your Node.js backend
            const backendError = error.response && error.response.data ? error.response.data.error : "Failed to add item to database.";
            Alert.alert("Error", backendError);
        } finally {
            setLoading(false);
        }
    };

    const generateBarcode = () => {
        const newBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setFormData({ ...formData, barcode: newBarcode });
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Add Item</Text>
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.staticText}>ITEM ID: Automatically from the database</Text>

                    <Text style={styles.label}>Barcode</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.barcode}
                        onChangeText={(text) => setFormData({...formData, barcode: text})}
                    />
                    
                    <View style={styles.barcodeButtonRow}>
                        <TouchableOpacity 
                            style={styles.barcodeBtn} 
                            onPress={() => Alert.alert("Coming Soon", "Camera scanning requires expo-camera package!")}
                        >
                            <Text style={styles.barcodeBtnText}>Scan Barcode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.barcodeBtn} onPress={generateBarcode}>
                            <Text style={styles.barcodeBtnText}>Create New</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Item Name:</Text>
                    <TextInput style={styles.input} value={formData.item_name} onChangeText={(text) => setFormData({...formData, item_name: text})} />

                    <Text style={styles.label}>Product Photo:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <TouchableOpacity 
                            style={[styles.btn, { backgroundColor: '#2c2c4d', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginRight: 15 }]} 
                            onPress={pickImage}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Choose Photo</Text>
                        </TouchableOpacity>

                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                        )}
                    </View>

                    <Text style={styles.label}>Item Group Name</Text>
                    {(() => {
                        // 🚀 FIXED: Only match based on the ID, prevent incorrect state binding
                        const selectedGroup = itemGroups.find(g => String(g.id) === String(formData.item_group_id));
                        const displayGroupName = selectedGroup ? selectedGroup.name : '';

                        return (
                            <CustomDropdown
                                data={itemGroups}
                                value={displayGroupName}
                                placeholder="Select an Item Group..."
                                onSelect={(selectedItem) => {
                                    setFormData({
                                        ...formData, 
                                        item_group_id: selectedItem.id, 
                                        item_group_name: selectedItem.name // 🚀 FIXED Typo here
                                    });
                                }}
                                onCreateNew={handleCreateNewGroup}
                            />
                        );
                    })()}

                    <Text style={styles.label}>GST Percentage</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.gst_percentage} onChangeText={(text) => setFormData({...formData, gst_percentage: text})} />

                    <Text style={styles.label}>MRP</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.mrp} onChangeText={(text) => setFormData({...formData, mrp: text})} />

                    <Text style={styles.label}>Purchase Rate</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(text) => setFormData({...formData, purchase_rate: text})} />

                    <Text style={styles.label}>Sale Rate</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.sale_rate} onChangeText={(text) => setFormData({...formData, sale_rate: text})} />

                    <Text style={styles.label}>Stock:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.stock} onChangeText={(text) => setFormData({...formData, stock: text})} />

                    <Text style={styles.label}>Unit:</Text>
                    <CustomDropdown
                        data={['Pks', 'Pcs', 'Kg', 'g', 'm', 'cm', 'L', 'ml']}
                        value={formData.unit}
                        placeholder="Select a unit..."
                        onSelect={(selectedItem) => {
                            setFormData({...formData, unit: selectedItem});
                        }}
                        onCreateNew={() => {
                            if (typeof window !== 'undefined' && window.prompt) {
                                const customUnit = window.prompt("Enter a new custom unit (e.g., Box, Dozen):");
                                if (customUnit) {
                                    setFormData({...formData, unit: customUnit});
                                }
                            } else {
                                Alert.alert("New Unit", "Custom units can be added here.");
                            }
                        }}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <Modal visible={isGroupModalVisible} animationType="fade" transparent={true}>
                <View style={styles.groupModalOverlay}>
                    <View style={styles.groupModalContainer}>
                        
                        <Text style={styles.groupModalTitle}>Create Item Group</Text>
                        <Text style={styles.groupModalLabelBold}>
                            Item Group ID: <Text style={{fontWeight: 'normal', color: '#666'}}>(Auto-Generated)</Text>
                        </Text>
                        
                        <Text style={styles.groupModalLabel}>Item Name:</Text>
                        <TextInput 
                            style={styles.groupModalInput}
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                            placeholder="e.g., Electronics, Dairy..."
                            placeholderTextColor="#888"
                            autoFocus={true}
                        />

                        <View style={styles.groupModalBtnRow}>
                            <TouchableOpacity 
                                style={styles.groupModalCancelBtn}
                                onPress={() => {
                                    setGroupModalVisible(false);
                                    setNewGroupName('');
                                }}
                            >
                                <Text style={styles.groupModalBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.groupModalSubmitBtn}
                                onPress={submitNewGroup}
                                disabled={isSubmittingGroup}
                            >
                                {isSubmittingGroup ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.groupModalBtnText}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
}