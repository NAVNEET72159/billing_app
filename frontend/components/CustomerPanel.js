import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import { styles } from '../styles/CustomerPanel.styles';
import AddCustomerModal from './AddCustomerModal';

export default function CustomerPanel({ customers, onSelectCustomer, onClose, refreshCustomers }) {
    const [searchText, setSearchText] = useState('');
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const filteredCustomers = (customers || []).filter(c => 
        {
            console.log('Fetching Customer: ')
            const safeName = c.customer_name ? String(c.customer_name).toLowerCase() : '';
            const safePhone = c.phone_number ? String(c.phone_number) : '';
            
            return safeName.includes(searchText.toLowerCase()) || safePhone.includes(searchText);
        }
    );
    return (
        <View style={styles.panelContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Customer</Text>
                {/* Only show the close button if an onClose function is provided */}
                {onClose && (
                    <TouchableOpacity onPress={onClose}>
                        <Image source={require('../assets/images/close.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.searchRow}>
                <SearchBar 
                    placeholder="Search Name or Number" 
                    value={searchText}
                    onChangeText={setSearchText}
                    containerStyle={{ flex: 1, marginRight: 15 }}
                />
                <TouchableOpacity 
                    style={styles.newButton}
                    onPress={() => setAddModalVisible(true)}
                >
                    <Text style={styles.newButtonText}>New +</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={filteredCustomers} 
                keyExtractor={(item) => item.customer_id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => onSelectCustomer(item)} 
                    >
                        <Text style={styles.cardText}>
                            <Text style={styles.boldLabel}>Customer Name: </Text>{item.customer_name}
                        </Text>
                        <Text style={styles.cardText}>
                            <Text style={styles.boldLabel}>Phone Number: </Text>{item.phone_number}
                        </Text>
                        <Text style={styles.cardText}>
                            <Text style={styles.boldLabel}>Address: </Text>{item.address || 'N/A'}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No matching customers found.</Text>}
            />
            <AddCustomerModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddSuccess={() => {
                    if (refreshCustomers) refreshCustomers();
                }}
            />
        </View>
    )
}