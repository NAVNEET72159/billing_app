import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/UpdateItemModel.styles';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown';
import * as ImagePicker from 'expo-image-picker';
import { getValidImageUrl } from '../components/utils/ImageHelper';

export default function UpdateItemModal({ visible, item, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [itemGroups, setItemGroups] = useState([]);
    const [isGroupModalVisible, setGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
    
    // 🚀 NEW: Image State
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        if (visible) {
            fetchGroups();
        }
        if (item) {
            setFormData({
                barcode: item.barcode || '',
                item_name: item.item_name || '',
                item_group_id: item.item_group_id || '',
                item_group_name: item.item_group_name || '',
                gst_percentage: item.gst_percentage ? String(item.gst_percentage) : '',
                mrp: item.mrp ? String(item.mrp) : '',
                purchase_rate: item.purchase_rate ? String(item.purchase_rate) : '',
                sale_rate: item.sale_rate ? String(item.sale_rate) : '',
                add_stock: '', 
                unit: item.unit || ''
            });
            // 🚀 Pre-load the existing image if it exists
            setImageUri(getValidImageUrl(item.image_url));
        }
    }, [visible, item]); 

    // 🚀 NEW: Image Picker Function
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
            
            setFormData({ 
                ...formData, 
                item_group_id: newGroupObj.id, 
                item_group_name: newGroupObj.name 
            });
            
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
        if (!item || !item.item_id) {
            Alert.alert("Error", "Missing Item ID. Cannot update.");
            return;
        }

        if (!formData.item_name) {
            Alert.alert("Validation", "Item name is required.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            
            let finalImageUrl = item.image_url; // Default to existing image URL

            // 🚀 NEW: Only upload if they picked a NEW image (it won't match the DB string)
            if (imageUri && imageUri !== item.image_url) {
                const imgData = new FormData();

                if (Platform.OS === 'web') {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    imgData.append('image', blob, `photo-${Date.now()}.jpg`);
                } else {
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

            const currentStock = parseInt(item.stock) || 0;
            const newlyAddedStock = parseInt(formData.add_stock) || 0;
            const finalCalculatedStock = currentStock + newlyAddedStock;
            
            const payload = {
                ...formData,
                item_group_id: formData.item_group_id ? parseInt(formData.item_group_id) : null,
                gst_percentage: parseFloat(formData.gst_percentage) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                stock: finalCalculatedStock,
                image_url: finalImageUrl // 🚀 Pass the image URL to update payload
            };

            await axios.put(`${API_URL}/items/${item.item_id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Item updated successfully!");
            onUpdateSuccess();
            onClose(); 
        } catch (error) {
            console.error("Update Item Error:", error);
            const backendError = error.response && error.response.data ? error.response.data.error : "Failed to update item.";
            Alert.alert("Error", backendError);
        } finally {
            setLoading(false);
        }
    };
    const handleCreateNewGroup = () => {
        Alert.alert(
            "New Item Group",
            "This will trigger your Add Group screen or database prompt.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => console.log("Open Add Group feature") }
            ]
        );
    };

    if (!visible || !item) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Update Item</Text>
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.staticText}>
                        <Text style={{fontWeight: '900', color: '#000'}}>Item ID: </Text>
                        {item.item_id}
                    </Text>

                    <Text style={styles.label}>Item Barcode:</Text>
                    <TextInput style={styles.input} value={formData.barcode} onChangeText={(text) => setFormData({...formData, barcode: text})} />

                    <Text style={styles.label}>Item Name:</Text>
                    <TextInput style={styles.input} value={formData.item_name} onChangeText={(text) => setFormData({...formData, item_name: text})} />

                    {/* 🚀 NEW UI: Photo Picker Button */}
                    <Text style={styles.label}>Product Photo:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <TouchableOpacity 
                            style={[styles.btn, { backgroundColor: '#2c2c4d', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginRight: 15 }]} 
                            onPress={pickImage}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Photo</Text>
                        </TouchableOpacity>

                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                        )}
                    </View>

                    <Text style={styles.label}>Item Group Name:</Text>
                    {(() => {
                        const selectedGroup = itemGroups.find(g => String(g.id) === String(formData.item_group_id));
                        const displayGroupName = selectedGroup ? selectedGroup.name : (formData.item_group_name || '');

                        return (
                            <CustomDropdown
                                data={itemGroups}
                                value={displayGroupName}
                                placeholder="Select an Item Group..."
                                onSelect={(selectedItem) => {
                                    setFormData({
                                        ...formData, 
                                        item_group_id: selectedItem.id, 
                                        item_group_name: selectedItem.name 
                                    });
                                }}
                                onCreateNew={() => setGroupModalVisible(true)}
                            />
                        );
                    })()}

                    <Text style={styles.label}>GST Percentage</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.gst_percentage} onChangeText={(text) => setFormData({...formData, gst_percentage: text})} />

                    <Text style={styles.label}>MRP:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.mrp} onChangeText={(text) => setFormData({...formData, mrp: text})} />

                    <Text style={styles.label}>Purchase Rate:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(text) => setFormData({...formData, purchase_rate: text})} />

                    <Text style={styles.label}>Sale Rate:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.sale_rate} onChangeText={(text) => setFormData({...formData, sale_rate: text})} />

                    <Text style={[styles.label, { color: '#1565c0', fontWeight: 'bold', marginTop: 5 }]}>Current Stock: {item.stock || 0}</Text>

                    <Text style={styles.label}>Add New Stock:</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        placeholder="e.g. 50"
                        value={formData.add_stock} 
                        onChangeText={(text) => setFormData({...formData, add_stock: text})} 
                    />
                    
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

                    {/* Form Controls */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Update</Text>}
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