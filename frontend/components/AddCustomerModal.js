import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/AddCustomerModal.styles';
import { API_URL } from '../config/api';

export default function AddCustomerModal({ visible, onClose, onAddSuccess }) {
    const [formData, setFormData] = useState({
        customer_name: '', code: '', phone_number: '', alternate_number: '', 
        email: '', current_address: '', permanent_address: '', city: '', state: '', pincode: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!formData.customer_name || !formData.phone_number) {
            Alert.alert("Validation", "Customer Name and Phone Number are required.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            
            await axios.post(`${API_URL}/customer`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Success", "Customer added successfully!");
            setFormData({ customer_name: '', code: '', phone_number: '', alternate_number: '', email: '', current_address: '', permanent_address: '', city: '', state: '', pincode: '' });
            onAddSuccess(); 
            onClose(); 
        } catch (error) {
            console.error("Add Customer Error:", error);
            Alert.alert("Error", "Failed to add customer to database.");
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Add Customer</Text>
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.staticText}>
                        <Text style={{fontWeight: '900', color: '#000'}}>Customer ID: </Text>
                        This is to be from the database
                    </Text>

                    <Text style={styles.label}>Customer Name:</Text>
                    <TextInput style={styles.input} value={formData.customer_name} onChangeText={(text) => setFormData({...formData, customer_name: text})} />
                    
                    {/* Side-by-Side Row for Code and Phone Number */}
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