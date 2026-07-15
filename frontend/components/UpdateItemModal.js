import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/UpdateItemModel.styles';
import { API_URL } from '../config/api';

export default function UpdateItemModal({ visible, item, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (item) {
            setFormData({
                item_name: item.item_name || '',
                purchase_rate: item.purchase_rate ? String(item.purchase_rate) : '',
                mrp: item.mrp ? String(item.mrp) : '',
                sale_rate: item.sale_rate ? String(item.sale_rate) : '',
                stock: item.stock ? String(item.stock) : '',
            });
        }
    }, [item]);

    const handleSave = async () => {
        if (!formData.item_name) {
            Alert.alert("Validation", "Item name is required.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = {
                ...formData,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                stock: parseInt(formData.stock) || 0,
            };

            await axios.put(`${API_URL}/items/${item.item_id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Item updated successfully!");
            onUpdateSuccess();
            onClose();
            } catch (error) {
            console.error("Update Error:", error);
            Alert.alert("Error", "Failed to update item.");
        } finally {
            setLoading(false);
        }
    };
    if (!visible || !item) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerTitle}>Update Item</Text>
                    
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.item_name}
                        onChangeText={(text) => setFormData({...formData, item_name: text})}
                    />

                    <Text style={styles.label}>Purchase Rate (₹)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        value={formData.purchase_rate}
                        onChangeText={(text) => setFormData({...formData, purchase_rate: text})}
                    />

                    <Text style={styles.label}>MRP (₹)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        value={formData.mrp}
                        onChangeText={(text) => setFormData({...formData, mrp: text})}
                    />

                    <Text style={styles.label}>Sale Rate (₹)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        value={formData.sale_rate}
                        onChangeText={(text) => setFormData({...formData, sale_rate: text})}
                    />

                    <Text style={styles.label}>Stock Quantity</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        value={formData.stock}
                        onChangeText={(text) => setFormData({...formData, stock: text})}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}