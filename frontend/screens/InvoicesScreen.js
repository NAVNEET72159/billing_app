import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, Modal, ScrollView, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print'; // 🚀 IMPORT EXPO PRINT
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

    const [isReturnModalVisible, setReturnModalVisible] = useState(false);
    const [itemToReturn, setItemToReturn] = useState(null);
    const [returnQty, setReturnQty] = useState('');
    const [returnLoading, setReturnLoading] = useState(false);

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
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            const msg = "Failed to load invoices.";
            Platform.OS !== 'web' ? Alert.alert("Error", msg) : window.alert(msg);
        } finally {
            setLoading(false);
        }
    }

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

    const executeInvoiceDelete = async (invoice) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/invoices/${invoice.sale_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(prev => prev.filter(i => String(i.sale_id) !== String(invoice.sale_id)));
            const successMsg = `Invoice ${invoice.invoice_number} deleted and stock restored!`;
            Platform.OS !== 'web' ? Alert.alert("Success", successMsg) : window.alert(successMsg);
        } catch (error) {
            console.error("Invoice Delete Error:", error);
            const errMsg = "Could not delete invoice.";
            Platform.OS !== 'web' ? Alert.alert("Error", errMsg) : window.alert(errMsg);
        }
    };

    const handleDeleteInvoice = (invoice) => {
        const warningMsg = `Are you sure you want to delete ${invoice.invoice_number}?\n\nThis will automatically restock ALL items.`;
        if (Platform.OS === 'web') {
            if (window.confirm(warningMsg)) executeInvoiceDelete(invoice);
        } else {
            Alert.alert("Delete Invoice", warningMsg, [
                { text: "Cancel", style: "cancel" },
                { text: "DELETE & RESTOCK", style: "destructive", onPress: () => executeInvoiceDelete(invoice) }
            ]);
        }
    };

    // ==========================================
    // 🚀 NEW: REPRINT RECEIPT LOGIC
    // ==========================================
    const handleReprint = async () => {
        if (!selectedInvoice || invoiceItems.length === 0) return;

        const currentTotal = invoiceItems.reduce((sum, i) => sum + parseFloat(i.amount), 0).toFixed(2);

        // Generate the HTML for the Receipt
        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 20px; color: #333; max-width: 800px; margin: auto; }
                    .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 20px; }
                    .header h1 { margin: 0; color: #2c2c4d; }
                    .invoice-info { margin-bottom: 20px; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border-bottom: 1px solid #ddd; padding: 10px 5px; text-align: left; }
                    th { background-color: #f8f8f8; font-weight: bold; }
                    .right-align { text-align: right; }
                    .center-align { text-align: center; }
                    .total-row { font-size: 20px; font-weight: bold; color: #2e7d32; text-align: right; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ShanDelay Enterprises</h1>
                    <h3>TAX INVOICE / RECEIPT</h3>
                </div>
                
                <div class="invoice-info">
                    <p><strong>Invoice No:</strong> ${selectedInvoice.invoice_number}</p>
                    <p><strong>Date:</strong> ${formatDate(selectedInvoice.sale_date)}</p>
                    <p><strong>Customer:</strong> ${selectedInvoice.customer_name || 'Walk-in Customer'}</p>
                    <p><strong>Payment Mode:</strong> ${selectedInvoice.payment_method || 'CASH'}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th class="center-align">Qty</th>
                            <th class="right-align">Rate (₹)</th>
                            <th class="right-align">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceItems.map(item => `
                            <tr>
                                <td>${item.item_name || 'Archived Item'}</td>
                                <td class="center-align">${item.quantity}</td>
                                <td class="right-align">${parseFloat(item.sale_rate).toFixed(2)}</td>
                                <td class="right-align">${parseFloat(item.amount).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-row">
                    Grand Total: ₹${currentTotal}
                </div>
                
                <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>Goods once sold can only be returned per store policy.</p>
                </div>
            </body>
            </html>
        `;

        try {
            if (Platform.OS === 'web') {
                // Cross-browser Web Printing
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                // Slight delay to allow CSS to load before printing
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            } else {
                // Mobile Printing (iOS/Android)
                await Print.printAsync({ html: htmlContent });
            }
        } catch (error) {
            console.error("Print Error:", error);
            Alert.alert("Error", "Could not print the invoice.");
        }
    };

    // ==========================================
    // RETURN ITEM LOGIC
    // ==========================================
    const openReturnModal = (item) => {
        setItemToReturn(item);
        setReturnQty(String(item.quantity)); 
        setReturnModalVisible(true);
    };

    const submitReturn = async () => {
        const qtyToReturn = parseInt(returnQty, 10);
        if (isNaN(qtyToReturn) || qtyToReturn <= 0 || qtyToReturn > itemToReturn.quantity) {
            Alert.alert("Invalid Quantity", `Please enter a number between 1 and ${itemToReturn.quantity}`);
            return;
        }

        setReturnLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(`${API_URL}/invoices/${selectedInvoice.sale_id}/return-item`, 
                {
                    item_id: itemToReturn.item_id,
                    return_quantity: qtyToReturn
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Success", "Item returned and inventory restocked!");
            setReturnModalVisible(false);
            
            handleViewDetails(selectedInvoice);
            fetchInvoices();
        } catch (error) {
            console.error("Return Error:", error);
            const backendError = error.response && error.response.data ? error.response.data.error : "Failed to process return.";
            Alert.alert("Error", backendError);
        } finally {
            setReturnLoading(false);
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
                        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => handleViewDetails(item)}>
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
                                    <Text style={styles.actionBtnText}>DELETE INVOICE & RESTOCK ALL</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No invoices found.</Text>}
                />
            )}

            {/* RECEIPT DETAILS MODAL */}
            <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Receipt Details</Text>
                        
                        {/* 🚀 NEW: Print & Close Buttons Side-by-Side */}
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                            <TouchableOpacity onPress={handleReprint} style={styles.printBtn}>
                                <Text style={styles.printBtnText}>🖨️ Print</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={{paddingVertical: 6}}>
                                <Text style={styles.closeBtnText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {selectedInvoice && (
                        <View style={styles.receiptInfoPanel}>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Invoice: </Text>{selectedInvoice.invoice_number}</Text>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Date: </Text>{formatDate(selectedInvoice.sale_date)}</Text>
                            <Text style={styles.receiptText}><Text style={styles.boldLabel}>Payment: </Text>{selectedInvoice.payment_method || "CASH"}</Text>
                            <Text style={[styles.receiptText, { marginTop: 10, fontSize: 18, color: '#7cb342', fontWeight: 'bold' }]}>
                                Grand Total: ₹{invoiceItems.reduce((sum, i) => sum + parseFloat(i.amount), 0).toFixed(2)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, {flex: 2}]}>Item</Text>
                        <Text style={[styles.tableHeaderText, {flex: 0.8, textAlign: 'center'}]}>Qty</Text>
                        <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'center'}]}>Total</Text>
                        <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Action</Text>
                    </View>

                    {loadingDetails ? (
                        <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {invoiceItems.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <Text style={[styles.itemText, {flex: 2}]} numberOfLines={2}>
                                        {item.item_name || "Archived Item"}
                                    </Text>
                                    <Text style={[styles.itemText, {flex: 0.8, textAlign: 'center'}]}>{item.quantity}</Text>
                                    <Text style={[styles.itemText, {flex: 1, textAlign: 'center'}]}>₹{item.amount}</Text>
                                    
                                    <TouchableOpacity 
                                        style={styles.returnItemBtn} 
                                        onPress={() => openReturnModal(item)}
                                    >
                                        <Text style={styles.returnItemText}>Return</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {invoiceItems.length === 0 && !loadingDetails && (
                                <Text style={[styles.emptyText, {marginTop: 20}]}>All items have been returned.</Text>
                            )}
                        </ScrollView>
                    )}
                </View>

                {/* RETURN SPECIFIC ITEM MODAL */}
                <Modal visible={isReturnModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.returnOverlay}>
                        <View style={styles.returnContainer}>
                            <Text style={styles.returnTitle}>Return Item</Text>
                            {itemToReturn && (
                                <Text style={styles.returnSub}>
                                    How many <Text style={{fontWeight: 'bold'}}>{itemToReturn.item_name}</Text> are being returned? (Max: {itemToReturn.quantity})
                                </Text>
                            )}

                            <TextInput 
                                style={styles.returnInput}
                                keyboardType="numeric"
                                value={returnQty}
                                onChangeText={setReturnQty}
                                selectTextOnFocus={true}
                            />

                            <View style={styles.returnBtnRow}>
                                <TouchableOpacity style={styles.returnCancelBtn} onPress={() => setReturnModalVisible(false)}>
                                    <Text style={styles.returnBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.returnConfirmBtn} onPress={submitReturn} disabled={returnLoading}>
                                    {returnLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.returnBtnText}>Confirm Return</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Modal>
        </View>
    );
}