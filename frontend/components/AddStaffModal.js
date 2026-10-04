import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { styles } from '../styles/AddStaffModal.styles'; // Importing the new styles

export default function AddStaffModal({ visible, onClose, onAddSuccess, currentUserRole }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Determine what we are creating purely for UI labels
    const targetRole = currentUserRole === 'ADMIN' ? 'Manager' : 'Salesperson';

    const handleSave = async () => {
        if (!username.trim() || !password.trim()) {
            const msg = "Please provide both a username and password.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(`${API_URL}/staff`, {
                username,
                password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsername('');
            setPassword('');
            onAddSuccess(); 
            onClose(); 
        } catch (error) {
            console.error("Add Staff Error:", error);
            const msg = error.response?.data?.error || "Failed to create user.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                
                <View style={styles.sidebar}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add New {targetRole}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeIcon}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput 
                            style={styles.inputField} 
                            placeholder="e.g. rahul_sales" 
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <Text style={styles.inputLabel}>Secure Password</Text>
                        <TextInput 
                            style={styles.inputField} 
                            placeholder="Enter temporary password" 
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                        
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                🔒 This password will be securely hashed using bcrypt before saving to the database.
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveBtnText}>CREATE {targetRole.toUpperCase()}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}