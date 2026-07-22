import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/InvoicesScreen.styles';
import Header from '../components/Header';
import { API_URL } from '../config/api';

export default function InvoiceScreen({ navigation }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/invoices`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(response.data); // Assuming you have a const [invoices, setInvoices] = useState([])
        } catch (error) {
            console.error("Error fetching invoices:", error);
            if (Platform.OS !== 'web') {
                Alert.alert("Error", "Failed to load invoices.");
            } else {
                window.alert("Failed to load invoices.");
            }
        } finally {
            setLoading(false);
        }
    }
    const executeInvoiceDelete = async (invoice) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/invoices/${invoice.sale_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(prev => prev.filter(i => String(i.sale_id) !== String(invoice.sale_id)));
        
            const successMsg = `Invoice ${invoice.invoice_number} deleted and stock restored!`;
            if (Platform.OS !== 'web') {
                Alert.alert("Success", successMsg);
            } else {
                window.alert(successMsg);
            }
        } catch (error) {
            console.error("Invoice Delete Error:", error);
            if ( Platform.OS !== 'web') {
                Alert.alert("Error", "Could not delete invoice.");
            } else {
                window.alert("Could not delete invoice.");
            }
        }
    };
    const handleViewDetails = async (invoice) => {
        setSelectedInvoice(invoice);
        setDetailModalVisible(true);
        setLoadingDetails(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/invoices/${invoice.sale_id}/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoiceItems(response.data);
        } catch (error) {
            console.error("Error fetching invoice items:", error);
            Alert.alert("Error", "Could not load item details.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleDeleteInvoice = (invoice) => {
        const warningMsg = `Are you sure you want to delete ${invoice.invoice_number}?\n\nThis will automatically restock the items.`;
    
        if (Platform.OS === 'web') {
            const confirmDelete = window.confirm(warningMsg);
            if (confirmDelete) {
                executeInvoiceDelete(invoice);
            }
        } else {
            Alert.alert(
                "Delete Invoice",
                warningMsg,
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "DELETE & RESTOCK", 
                        style: "destructive", 
                        onPress: () => executeInvoiceDelete(invoice)
                    }
                ]
            );
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <Header />
            </View>
            
            <Text style={styles.pageTitle}>Billing History</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={invoices}
                    keyExtractor={(item, index) => item.sale_id ? item.sale_id.toString() : index.toString()}
                    contentContainerStyle={styles.listContainer} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} activeOpacity={0.7}
                            onPress={() => handleViewDetails(item)} >
                            <View style={styles.cardHeader}>
                                <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
                                <Text style={styles.grandTotal}>₹{item.grand_total}</Text>
                            </View>

                            <Text style={styles.detailText}>
                                <Text style={styles.boldLabel}>Date: {formatDate(item.sale_date)} </Text>
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldLabel}>Customer: </Text>{item.customer_name || "Walk-in Customer"}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldLabel}>Payment: </Text>{item.payment_method || "CASH"}
                            </Text>

                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={styles.deleteBtn} 
                                    onPress={(e) => { e.stopPropagation(); handleDeleteInvoice(item);}}
                                >
                                    <Text style={styles.actionBtnText}>DELETE & RESTOCK</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No invoices found.</Text>}
                />
            )}
            <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Receipt Details</Text>
                        <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedInvoice && (
                        <View style={styles.receiptInfoPanel}>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Invoice: </Text>{selectedInvoice.invoice_number}</Text>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Date: </Text>{formatDate(selectedInvoice.sale_date)}</Text>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Payment: </Text>{selectedInvoice.payment_method || "CASH"}</Text>
                            <Text style={[styles.receiptText, { marginTop: 10, fontSize: 18, color: '#7cb342', fontWeight: 'bold' }]}>
                                Grand Total: ₹{selectedInvoice.grand_total}
                            </Text>
                        </View>
                    )}

                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colName]}>Item</Text>
                        <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
                        <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
                        <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
                    </View>

                    {loadingDetails ? (
                        <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {invoiceItems.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    {/* Handle deleted items gracefully if name is null */}
                                    <Text style={[styles.itemText, styles.colName]} numberOfLines={2}>
                                        {item.item_name || "Archived Item"}
                                    </Text>
                                    <Text style={[styles.itemText, styles.colQty]}>{item.quantity}</Text>
                                    <Text style={[styles.itemText, styles.colRate]}>₹{item.sale_rate}</Text>
                                    <Text style={[styles.itemText, styles.colTotal]}>₹{item.amount}</Text>
                                </View>
                            ))}
                            {invoiceItems.length === 0 && !loadingDetails && (
                                <Text style={styles.emptyText}>No items found for this invoice.</Text>
                            )}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
};
