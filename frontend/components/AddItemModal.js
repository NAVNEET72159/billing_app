import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/AddItemModal.styles';
import { API_URL } from '../config/api';

export default function AddItemModal({ visible, onClose, onAddSuccess }) {
    const [formData, setFormData] = useState({
        barcode: '', item_name: '', item_group_name: '', gst_percentage: '',
        mrp: '', purchase_rate: '', sale_rate: '', stock: '', unit: ''
    });
    const [loading, setLoading] = useState(false);
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
                gst_percentage: parseFloat(formData.gst_percentage) || 0,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                stock: parseInt(formData.stock) || 0,
            };

            await axios.post(`${API_URL}/items`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Item added successfully!");

            setFormData({ barcode: '', item_name: '', item_group_name: '', gst_percentage: '', mrp: '', purchase_rate: '', sale_rate: '', stock: '', unit: '' });
            onAddSuccess(); 
            onClose(); 
        } catch (error) {
            console.error("Add Error:", error);
            Alert.alert("Error", "Failed to add item to database.");
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

                    <Text style={styles.label}>Item Group Name</Text>
                    <TextInput style={styles.input} value={formData.item_group_name} onChangeText={(text) => setFormData({...formData, item_group_name: text})} />

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
                    <TextInput style={styles.input} value={formData.unit} onChangeText={(text) => setFormData({...formData, unit: text})} />

                    {/* Bottom Action Buttons */}
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
        </Modal>
    );
}