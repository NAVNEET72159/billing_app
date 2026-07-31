import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Manufacturing.styles';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown';

export default function ProductionReportScreen({ navigation }) {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [itemGroups, setItemGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        barcode: '', item_name: '', item_group_id: '', item_group_name: '', 
        gst_percentage: '', mrp: '', purchase_rate: '', sale_rate: '', raw_material_used: ''
    });

    useEffect(() => {
        fetchDependencies();
    }, []);

    const fetchDependencies = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            
            const groupRes = await axios.get(`${API_URL}/groups`, { headers: { Authorization: `Bearer ${token}` } });
            setItemGroups(groupRes.data.map(g => ({ id: g.item_group_id, name: g.group_name })));

            const rawRes = await axios.get(`${API_URL}/raw-materials`, { headers: { Authorization: `Bearer ${token}` } });
            setRawMaterials(rawRes.data.map(r => ({ id: r.raw_id, name: r.item_name })));
            
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const generateBarcode = () => {
        const newBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setFormData({ ...formData, barcode: newBarcode });
    };

    const handleSaveProduction = async () => {
        Alert.alert("Development Note", "Ready to link to your /items API endpoint!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Production Report</Text>
                
                <Text style={styles.staticText}>
                    <Text style={{fontWeight: 'bold'}}>Item ID: </Text>
                    This is be from the database
                </Text>

                <Text style={styles.label}>Item Barcode:</Text>
                <TextInput style={styles.input} value={formData.barcode} onChangeText={(t) => setFormData({...formData, barcode: t})} />

                <TouchableOpacity style={styles.generateBtn} onPress={generateBarcode}>
                    <Text style={styles.generateBtnText}>Generate Barcode</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Item Name:</Text>
                <TextInput style={styles.input} value={formData.item_name} onChangeText={(t) => setFormData({...formData, item_name: t})} />

                <Text style={styles.label}>Item Group Name:</Text>
                <CustomDropdown
                    data={itemGroups}
                    value={formData.item_group_name}
                    placeholder="Select Group..."
                    onSelect={(item) => setFormData({...formData, item_group_id: item.id, item_group_name: item.name})}
                    onCreateNew={() => Alert.alert("Note", "Use Item Group screen to add new.")}
                />

                <Text style={styles.label}>GST Percentage</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.gst_percentage} onChangeText={(t) => setFormData({...formData, gst_percentage: t})} />

                <Text style={styles.label}>MRP:</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.mrp} onChangeText={(t) => setFormData({...formData, mrp: t})} />

                <Text style={styles.label}>Purchase Rate:</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(t) => setFormData({...formData, purchase_rate: t})} />

                <Text style={styles.label}>Sale Rate:</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.sale_rate} onChangeText={(t) => setFormData({...formData, sale_rate: t})} />

                <Text style={styles.label}>Raw Material Used</Text>
                <CustomDropdown
                    data={rawMaterials}
                    value={formData.raw_material_used}
                    placeholder="Select Raw Material..."
                    onSelect={(item) => setFormData({...formData, raw_material_used: item.name})}
                    onCreateNew={() => Alert.alert("Note", "Add new materials in the Raw Materials screen.")}
                />

                <View style={{marginTop: 20, alignItems: 'center'}}>
                    <TouchableOpacity style={[styles.submitBtn, {width: '100%'}]} onPress={handleSaveProduction}>
                        <Text style={styles.btnText}>Save Production Data</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}