import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Manufacturing.styles';
import { API_URL } from '../config/api';

export default function RawMaterialsScreen({ navigation }) {
    const [formData, setFormData] = useState({ item_name: '', purchase_rate: '', stock: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.item_name) {
            Alert.alert("Validation", "Item Name is required.");
            return;
        }

        setLoading(true);
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
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save raw material.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Raw Materials</Text>
                
                <Text style={styles.staticText}>
                    <Text style={{fontWeight: 'bold'}}>Raw Item ID: </Text>
                    This is to be from the database
                </Text>

                <Text style={styles.label}>Item Name:</Text>
                <TextInput 
                    style={styles.input} 
                    value={formData.item_name}
                    onChangeText={(text) => setFormData({...formData, item_name: text})}
                />

                <Text style={styles.label}>Purchase Rate:</Text>
                <TextInput 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={formData.purchase_rate}
                    onChangeText={(text) => setFormData({...formData, purchase_rate: text})}
                />

                <Text style={styles.label}>Stock</Text>
                <TextInput 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={formData.stock}
                    onChangeText={(text) => setFormData({...formData, stock: text})}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit</Text>}
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}