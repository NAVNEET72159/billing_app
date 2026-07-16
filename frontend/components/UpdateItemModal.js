import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/UpdateItemModel.styles';
import { API_URL } from '../config/api';

export default function UpdateItemModal({ visible, item, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (item) {
            setFormData({
                barcode: item.barcode || '',
                item_name: item.item_name || '',
                item_group_id: item.item_group_id || '',
                gst_percentage: item.gst_percentage ? String(item.gst_percentage) : '',
                mrp: item.mrp ? String(item.mrp) : '',
                purchase_rate: item.purchase_rate ? String(item.purchase_rate) : '',
                sale_rate: item.sale_rate ? String(item.sale_rate) : '',
                add_stock: '',
                unit: item.unit || ''
            });
        }
    }, [item]);

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
            const currentStock = parseInt(item.stock) || 0;
            const newlyAddedStock = parseInt(formData.add_stock) || 0;
            const finalCalculatedStock = currentStock + newlyAddedStock;
            console.log(finalCalculatedStock, " ", newlyAddedStock, " ", currentStock);
            
            // Cast input numbers safely so the backend doesn't throw a SQL error
            const payload = {
                ...formData,
                gst_percentage: parseFloat(formData.gst_percentage) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                stock: finalCalculatedStock,
            };

            await axios.put(`${API_URL}/items/${item.item_id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Item updated successfully!");
            onUpdateSuccess(); // Instantly reloads the main Inventory list
            onClose(); 
        } catch (error) {
            console.error("Update Item Error:", error);
            Alert.alert("Error", "Failed to update item.");
        } finally {
            setLoading(false);
        }
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

                    <Text style={styles.label}>Item Group Name:</Text>
                    <TextInput style={styles.input} value={formData.item_group_id} onChangeText={(text) => setFormData({...formData, item_group_id: text})} />

                    <Text style={styles.label}>GST Percentage</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.gst_percentage} onChangeText={(text) => setFormData({...formData, gst_percentage: text})} />

                    <Text style={styles.label}>MRP:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.mrp} onChangeText={(text) => setFormData({...formData, mrp: text})} />

                    <Text style={styles.label}>Purchase Rate:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(text) => setFormData({...formData, purchase_rate: text})} />

                    <Text style={styles.label}>Sale Rate:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.sale_rate} onChangeText={(text) => setFormData({...formData, sale_rate: text})} />

                    <Text style={styles.label}>Stock:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.add_stock} onChangeText={(text) => setFormData({...formData, add_stock: text})} />

                    <Text style={styles.label}>Unit:</Text>
                    <TextInput style={styles.input} value={formData.unit} onChangeText={(text) => setFormData({...formData, unit: text})} />

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
        </Modal>
    );
}