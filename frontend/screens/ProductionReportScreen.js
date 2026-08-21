import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Platform, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Manufacturing.styles';
import { API_URL } from '../config/api';
import CustomDropdown from '../components/CustomDropdown';

export default function ProductionReportScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('New'); // 'New' or 'History'

    const [rawMaterials, setRawMaterials] = useState([]);
    const [itemGroups, setItemGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Final Product Form
    const [formData, setFormData] = useState({
        barcode: '', item_name: '', item_group_id: '', item_group_name: '', 
        gst_percentage: '', mrp: '', purchase_rate: '', sale_rate: '', units_produced: '1', unit: ''
    });

    // Recipe Builder States
    const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
    const [rawQtyUsed, setRawQtyUsed] = useState('');
    const [rawUnitUsed, setRawUnitUsed] = useState('');
    const [usedMaterialsList, setUsedMaterialsList] = useState([]);

    // History States
    const [productionHistory, setProductionHistory] = useState([]);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchDependencies();
        fetchHistory();
    }, []);

    const fetchDependencies = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const groupRes = await axios.get(`${API_URL}/groups`, { headers: { Authorization: `Bearer ${token}` } });
            setItemGroups(groupRes.data.map(g => ({ id: g.item_group_id, name: g.group_name })));
            const rawRes = await axios.get(`${API_URL}/raw-materials`, { headers: { Authorization: `Bearer ${token}` } });
            setRawMaterials(rawRes.data.map(r => ({ id: r.raw_id, name: r.item_name, unit: r.unit })));
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/production-logs`, { headers: { Authorization: `Bearer ${token}` } });
            setProductionHistory(response.data);
        } catch (error) {
            console.error("History Fetch Error:", error);
        }
    };

    const generateBarcode = () => {
        const newBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setFormData({ ...formData, barcode: newBarcode });
    };

    // 🚀 NEW: Fetch Existing Recipe & Product Specs
    const fetchItemDetails = async () => {
        if (!formData.barcode) {
            Alert.alert("Missing Barcode", "Please enter a barcode to search for an existing product.");
            return;
        }
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/production/recipe/${formData.barcode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const { item, recipe } = response.data;
            
            // Auto-fill the group dropdown name
            const matchedGroup = itemGroups.find(g => String(g.id) === String(item.item_group_id));

            setFormData({
                ...formData,
                item_name: item.item_name || '',
                item_group_id: item.item_group_id || '',
                item_group_name: matchedGroup ? matchedGroup.name : '',
                gst_percentage: String(item.gst_percentage || ''),
                mrp: String(item.mrp || ''),
                purchase_rate: String(item.purchase_rate || ''),
                sale_rate: String(item.sale_rate || ''),
                unit: item.unit || '',
                units_produced: '1' // Reset to 1 for the new batch
            });

            setUsedMaterialsList(recipe || []);
            Platform.OS === 'web' ? window.alert("Recipe Loaded!") : Alert.alert("Success", "Recipe Loaded!");
        } catch (error) {
            const msg = "No existing product or recipe found with this barcode.";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Not Found", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMaterialToRecipe = () => {
        if (!selectedRawMaterial || !rawQtyUsed || !rawUnitUsed) {
            Alert.alert("Missing Info", "Please select a material, enter a quantity, and choose a unit.");
            return;
        }
        const newMaterial = {
            id: selectedRawMaterial.id,
            name: selectedRawMaterial.name,
            unit: rawUnitUsed,
            qty: parseFloat(rawQtyUsed)
        };
        setUsedMaterialsList([...usedMaterialsList, newMaterial]);
        setSelectedRawMaterial(null);
        setRawQtyUsed('');
        setRawUnitUsed('');
    };

    const handleRemoveMaterial = (indexToRemove) => {
        setUsedMaterialsList(usedMaterialsList.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveProduction = async () => {
        if (!formData.item_name || usedMaterialsList.length === 0) {
            Alert.alert("Validation", "Please enter a product name and add at least one raw material to the recipe.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = {
                ...formData,
                item_group_id: formData.item_group_id ? parseInt(formData.item_group_id) : null,
                gst_percentage: parseFloat(formData.gst_percentage) || 0,
                mrp: parseFloat(formData.mrp) || 0,
                purchase_rate: parseFloat(formData.purchase_rate) || 0,
                sale_rate: parseFloat(formData.sale_rate) || 0,
                units_produced: parseInt(formData.units_produced) || 1,
                used_materials: usedMaterialsList 
            };

            await axios.post(`${API_URL}/production`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const successMsg = `Successfully recorded production run for ${formData.item_name}! Inventory and ledgers have been updated.`;
            
            if (Platform.OS === 'web') {
                window.alert(successMsg);
            } else {
                Alert.alert("Production Saved 🎉", successMsg);
            }
            
            setFormData({ barcode: '', item_name: '', item_group_id: '', item_group_name: '', gst_percentage: '', mrp: '', purchase_rate: '', sale_rate: '', units_produced: '1', unit: '' });
            setUsedMaterialsList([]);
            
            navigation.goBack();

        } catch (error) {
            console.error("Production Error:", error);
            const backendError = error.response && error.response.data ? error.response.data.error : "Failed to process production.";
            
            if (Platform.OS === 'web') {
                window.alert(`Error: ${backendError}`);
            } else {
                Alert.alert("Error", backendError);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = productionHistory.filter(log => {
        if (!filterDate) return true;
        return log.production_date && log.production_date.startsWith(filterDate);
    });

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const d = new Date(dateString);
        return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Production</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'New' && styles.activeTab]} 
                    onPress={() => setActiveTab('New')}
                >
                    <Text style={[styles.tabText, activeTab === 'New' && styles.activeTabText]}>New Batch</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'History' && styles.activeTab]} 
                    onPress={() => setActiveTab('History')}
                >
                    <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'New' && (
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.staticText}>
                        <Text style={{fontWeight: 'bold'}}>Final Product Specs:</Text>
                    </Text>

                    <Text style={styles.label}>Item Barcode:</Text>
                    <TextInput style={styles.input} value={formData.barcode} onChangeText={(t) => setFormData({...formData, barcode: t})} />

                    {/* 🚀 NEW: Side-by-side Generate & Fetch Buttons */}
                    <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
                        <TouchableOpacity style={[styles.generateBtn, {flex: 1, marginTop: 0}]} onPress={generateBarcode}>
                            <Text style={styles.generateBtnText}>Generate New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.generateBtn, {flex: 1, marginTop: 0, backgroundColor: '#1565c0'}]} onPress={fetchItemDetails}>
                            <Text style={styles.generateBtnText}>Fetch Existing</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Item Name (Output):</Text>
                    <TextInput style={styles.input} placeholder="e.g. Masala Paste" value={formData.item_name} onChangeText={(t) => setFormData({...formData, item_name: t})} />

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

                    <Text style={styles.label}>MRP (₹):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.mrp} onChangeText={(t) => setFormData({...formData, mrp: t})} />

                    <Text style={styles.label}>Purchase Rate (₹):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.purchase_rate} onChangeText={(t) => setFormData({...formData, purchase_rate: t})} />

                    <Text style={styles.label}>Sale Rate (₹):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={formData.sale_rate} onChangeText={(t) => setFormData({...formData, sale_rate: t})} />

                    <Text style={styles.label}>Yield (Units Produced):</Text>
                    <View style={styles.rowInputContainer}>
                        <TextInput 
                            style={[styles.input, styles.halfInput]} 
                            keyboardType="numeric" 
                            value={formData.units_produced} 
                            onChangeText={(t) => setFormData({...formData, units_produced: t})} 
                        />
                        <View style={styles.halfDropdown}>
                            <CustomDropdown
                                data={['Pks', 'Pcs', 'Kg', 'g', 'm', 'cm', 'L', 'ml']}
                                value={formData.unit}
                                placeholder="Unit..."
                                onSelect={(selectedItem) => setFormData({...formData, unit: selectedItem})}
                                onCreateNew={() => {
                                    if (typeof window !== 'undefined' && window.prompt) {
                                        const customUnit = window.prompt("Enter a custom unit:");
                                        if (customUnit) setFormData({...formData, unit: customUnit});
                                    } else {
                                        Alert.alert("New Unit", "Custom units can be added here.");
                                    }
                                }}
                            />
                        </View>
                    </View>

                    {/* RECIPE BUILDER SECTION */}
                    <View style={styles.recipeDivider} />
                    <Text style={[styles.title, {fontSize: 22, marginBottom: 15}]}>Recipe / Materials Used</Text>

                    <View style={styles.recipeBuilderContainer}>
                        <Text style={styles.label}>Select Raw Material</Text>
                        <CustomDropdown
                            data={rawMaterials}
                            value={selectedRawMaterial ? selectedRawMaterial.name : ''}
                            placeholder="e.g. Cardamom, Thread..."
                            onSelect={(item) => {
                                setSelectedRawMaterial(item);
                                setRawUnitUsed(item.unit || ''); 
                            }}
                            onCreateNew={() => Alert.alert("Note", "Add new materials in the Raw Materials screen.")}
                        />

                        <Text style={styles.label}>Quantity Used:</Text>
                        <View style={styles.rowInputContainer}>
                            <TextInput 
                                style={[styles.input, styles.halfInput]} 
                                keyboardType="numeric" 
                                placeholder="e.g. 50"
                                value={rawQtyUsed} 
                                onChangeText={setRawQtyUsed} 
                            />
                            <View style={styles.halfDropdown}>
                                <CustomDropdown
                                    data={['Pks', 'Pcs', 'Kg', 'g', 'm', 'cm', 'L', 'ml']}
                                    value={rawUnitUsed}
                                    placeholder="Unit..."
                                    onSelect={(selectedItem) => setRawUnitUsed(selectedItem)}
                                    onCreateNew={() => {
                                        if (typeof window !== 'undefined' && window.prompt) {
                                            const customUnit = window.prompt("Enter a custom unit:");
                                            if (customUnit) setRawUnitUsed(customUnit);
                                        } else {
                                            Alert.alert("New Unit", "Custom units can be added here.");
                                        }
                                    }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.addMaterialBtn} onPress={handleAddMaterialToRecipe}>
                            <Text style={styles.addMaterialBtnText}>+ Add to Recipe</Text>
                        </TouchableOpacity>
                    </View>

                    {usedMaterialsList.length > 0 && (
                        <View style={styles.recipeListCard}>
                            <Text style={{fontWeight: 'bold', marginBottom: 10, color: '#333'}}>Materials in this Batch:</Text>
                            {usedMaterialsList.map((mat, index) => (
                                <View key={index} style={styles.recipeListItem}>
                                    <Text style={{fontSize: 16, color: '#000'}}>• {mat.name}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 15}}>{mat.qty} {mat.unit}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveMaterial(index)}>
                                            <Text style={{color: '#DE3931', fontWeight: 'bold', fontSize: 20}}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{marginTop: 30, alignItems: 'center', marginBottom: 50}}>
                        <TouchableOpacity style={[styles.submitBtn, {width: '100%'}]} onPress={handleSaveProduction} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Production Run</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'History' && (
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <View style={styles.dateFilterContainer}>
                        <Text style={styles.label}>Filter by Date:</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="YYYY-MM-DD"
                            value={filterDate}
                            onChangeText={setFilterDate}
                        />
                    </View>

                    <FlatList 
                        data={filteredHistory}
                        keyExtractor={(item) => item.log_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        renderItem={({ item }) => (
                            <View style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <Text style={styles.historyItemName}>{item.item_name}</Text>
                                    <View style={styles.yieldBadge}>
                                        <Text style={styles.yieldText}>Yield: {item.units_produced} {item.unit || ''}</Text>
                                    </View>
                                </View>
                                <Text style={styles.historyDate}>Created: {formatDate(item.production_date)}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 30, color: '#666'}}>No production records found for this date.</Text>}
                    />
                </View>
            )}

        </View>
    );
}