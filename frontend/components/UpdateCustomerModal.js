import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import styles from '../styles/UpdateCustomerModal.styles'

export default function UpdateCustomerModal({ visible, customer, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (customer) {
            setFormData({
                customer_name: customer.customer_name || '',
                code: customer.code || '',
                phone_number: customer.phone_number || '',
                alternate_number: customer.alternate_number || '',
                email: customer.email || '',
                current_address: customer.current_address || '',
                permanent_address: customer.permanent_address || '',
                city: customer.city || '',
                state: customer.state || '',
                pincode: customer.pincode ? String(customer.pincode) : ''
            });
        }
    }, [customer]);
    const handleSave = async () => {
        if (!formData.customer_name || !formData.phone_number) {
            Alert.alert("Validation", "Customer Name and Phone Number are required.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            
            await axios.put(`${API_URL}/customers/${customer.customer_id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Customer updated successfully!");
            onUpdateSuccess();
            onClose();
            } catch (error) {
            console.error("Update Customer Error:", error);
            Alert.alert("Error", "Failed to update customer.");
        } finally {
            setLoading(false);
        }
    };
    if (!visible || !customer) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Update Customer</Text>
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.label}>Customer Name:</Text>
                    <TextInput style={styles.input} value={formData.customer_name} onChangeText={(text) => setFormData({...formData, customer_name: text})} />
                    
                    <View style={styles.row}>
                        <View style={styles.codeColumn}>
                            <Text style={styles.label}>Code</Text>
                            <TextInput style={styles.input} value={formData.code} onChangeText={(text) => setFormData({...formData, code: text})} />
                        </View>
                        <View style={styles.phoneColumn}>
                            <Text style={styles.label}>Phone Number:</Text>
                            <TextInput style={styles.input} keyboardType="phone-pad" value={formData.phone_number} onChangeText={(text) => setFormData({...formData, phone_number: text})} />
                        </View>
                    </View>

                    <Text style={styles.label}>Alternate Number</Text>
                    <TextInput style={styles.input} keyboardType="phone-pad" value={formData.alternate_number} onChangeText={(text) => setFormData({...formData, alternate_number: text})} />

                    <Text style={styles.label}>E-Mail</Text>
                    <TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(text) => setFormData({...formData, email: text})} />

                    <Text style={styles.label}>Current Address:</Text>
                    <TextInput style={styles.input} value={formData.current_address} onChangeText={(text) => setFormData({...formData, current_address: text})} />

                    <Text style={styles.label}>Permanent Address:</Text>
                    <TextInput style={styles.input} value={formData.permanent_address} onChangeText={(text) => setFormData({...formData, permanent_address: text})} />

                    <Text style={styles.label}>City:</Text>
                    <TextInput style={styles.input} value={formData.city} onChangeText={(text) => setFormData({...formData, city: text})} />

                    <Text style={styles.label}>State:</Text>
                    <TextInput style={styles.input} value={formData.state} onChangeText={(text) => setFormData({...formData, state: text})} />

                    <Text style={styles.label}>Pincode:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.pincode} onChangeText={(text) => setFormData({...formData, pincode: text})} />

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