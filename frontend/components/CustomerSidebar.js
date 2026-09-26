import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import SearchBar from './SearchBar';

export default function CustomerSidebar({ visible, customers, onSelectCustomer, onClose }) {
    const [searchText, setSearchText] = useState('');

    // Filter customers based on name or phone number
    const filteredCustomers = (customers || []).filter(c => 
        (c.customer_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (c.phone_number || '').includes(searchText)
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                {/* Invisible background button to close modal when clicking outside */}
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                
                <View style={styles.sidebar}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Customer</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeIcon}>×</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Search and Walk-in Action */}
                    <View style={styles.searchSection}>
                        <SearchBar 
                            placeholder="Search name or phone..." 
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <TouchableOpacity style={styles.walkInBtn} onPress={() => onSelectCustomer(null)}>
                            <Text style={styles.walkInBtnText}>🚶‍♂️ PROCEED AS WALK-IN</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Customer List */}
                    <FlatList 
                        data={filteredCustomers}
                        keyExtractor={(item) => item.customer_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.customerCard} 
                                activeOpacity={0.7}
                                onPress={() => onSelectCustomer(item)}
                            >
                                <View>
                                    <Text style={styles.customerName}>{item.customer_name}</Text>
                                    <Text style={styles.customerPhone}>📞 {item.phone_number}</Text>
                                </View>
                                <Text style={styles.arrowIcon}>➔</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    sidebar: {
        width: Platform.OS === 'web' ? 400 : '85%',
        backgroundColor: '#f8f9fa',
        height: '100%',
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    closeBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 22,
        color: '#666',
        fontWeight: 'bold',
        lineHeight: 24,
    },
    searchSection: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#f8f9fa',
    },
    walkInBtn: {
        marginTop: 15,
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    walkInBtnText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    customerCard: {
        padding: 18,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    customerPhone: {
        fontSize: 13,
        color: '#666',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#00D26A',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
        fontSize: 15,
    }
});