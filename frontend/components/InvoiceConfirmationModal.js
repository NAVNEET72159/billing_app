import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { styles } from '../styles/InvoiceConfirmationModal.styles'

export default function InvoiceConfirmationModal({ visible, cart, customer, grandTotal, onConfirm, onCancel }) {
    if (!visible || !customer) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerTitle}>Confirm Sale</Text>
                    
                    <ScrollView style={styles.previewBox}>
                        <Text style={styles.previewHeader}>Billed To: {customer.customer_name}</Text>
                        <Text style={styles.previewSub}>Phone: {customer.phone_number}</Text>
                        
                        <View style={styles.divider} />
                        
                        {cart.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View>
                                    <Text style={styles.itemName}>{item.item_name}</Text>
                                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemTotal}>₹{(item.sale_rate * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.totalRow}>
                            <Text style={styles.grandTotalText}>Grand Total:</Text>
                            <Text style={styles.grandTotalAmount}>₹{grandTotal.toFixed(2)}</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={onConfirm}>
                            <Text style={styles.confirmBtnText}>Confirm & Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}