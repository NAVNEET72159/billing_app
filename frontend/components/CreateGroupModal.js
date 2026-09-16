import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { styles } from '../styles/GroupModal.styles';

export default function CreateGroupModal({ visible, onClose, onSuccess }) {
    const [newGroupName, setNewGroupName] = useState('');
    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);

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
            
            // Format the new object exactly how the dropdowns expect it
            const newGroupObj = { 
                name: response.data.group_name, 
                id: response.data.item_group_id 
            };
            
            Alert.alert("Success", "Category created!");
            setNewGroupName(''); // Reset input
            
            // 🚀 Pass the new data back to whatever screen opened the modal
            if (onSuccess) {
                onSuccess(newGroupObj);
            }
            onClose(); // Close the modal
        } catch (error) {
            console.error("Submit Group Error:", error);
            const errMsg = error.response && error.response.data && error.response.data.error 
                ? error.response.data.error 
                : "Failed to create category.";
            Alert.alert("Error", errMsg);
        } finally {
            setIsSubmittingGroup(false);
        }
    };

    const handleCancel = () => {
        setNewGroupName('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.groupModalOverlay}>
                <View style={styles.groupModalContainer}>
                    
                    <Text style={styles.groupModalTitle}>Create New Category</Text>
                    <Text style={styles.groupModalLabelBold}>
                        Category ID: <Text style={{fontWeight: 'normal', color: '#666'}}>(Auto-Generated)</Text>
                    </Text>
                    
                    <Text style={styles.groupModalLabel}>Category Name:</Text>
                    <TextInput 
                        style={styles.groupModalInput}
                        value={newGroupName}
                        onChangeText={setNewGroupName}
                        placeholder="e.g., Electronics, Dairy..."
                        placeholderTextColor="#888"
                        autoFocus={true}
                    />

                    <View style={styles.groupModalBtnRow}>
                        <TouchableOpacity style={styles.groupModalCancelBtn} onPress={handleCancel}>
                            <Text style={[styles.groupModalBtnText, { color: '#333' }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.groupModalSubmitBtn} onPress={submitNewGroup} disabled={isSubmittingGroup}>
                            {isSubmittingGroup ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.groupModalBtnText}>Save Category</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}