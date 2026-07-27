import BottomNav from '../components/BottomNav';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/NewBillScreen.styles';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import CustomerPanel from '../components/CustomerPanel';
import InvoiceConfirmationModal from '../components/InvoiceConfirmationModal';
import { generateInvoicePDF } from '../components/utils/InvoicePDF';
import { API_URL } from '../config/api';

export default function NewBillScreen({ navigation }) {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isCustomerModalVisible, setCustomerModalVisible] = useState(false);
    const [itemSearchText, setItemSearchText] = useState('');
    const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
    const [isConfirmationVisible, setConfirmationVisible] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(false);
    useEffect(() => {
        fetchInventory();
        fetchCustomers();
    }, []);
    const fetchCustomers = async () => {
        console.log("Started this function: ")
        try {
            console.log("Started try: ")
            const token = await AsyncStorage.getItem('userToken');
            console.log("Checkpoint 1: Token fetched successfully!");

            console.log(`Checkpoint 2: Attempting to connect to ${API_URL}...`);
            const response = await axios.get(`${API_URL}/customers`, {
                headers: { Authorization: `Bearer ${token}`},
                timeout: 5000
            });
            console.log("Checkpoint 3: BACKEND RESPONSE RECEIVED!", response.data);
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };
    const fetchInventory = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            Alert.alert("Error", "Failed to load inventory. Check your network.");
            setLoading(false);
        }
    };
    const addToCart = (item) => {
        if (item.stock <= 0) {
            const errorMsg = `${item.item_name} is unavailable in the inventory (Out of Stock).`;
            if (Platform.OS === 'web') {
                window.alert(errorMsg);
            } else {
                Alert.alert("Item Unavailable", errorMsg);
            }
            return;
        }
        const existingCartItem = cart.find(c => c.item_id === item.item_id);
        if (existingCartItem && existingCartItem.quantity >= item.stock) {
            const limitMsg = `You cannot add more ${item.item_name}. Only ${item.stock} left in stock.`;
            if (Platform.OS === 'web') {
                window.alert(limitMsg);
            } else {
                Alert.alert("Stock Limit Reached", limitMsg);
            }
            return;
        }
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.item_id === item.item_id);
            if (existingItem) {
                return currentCart.map(cartItem =>
                    cartItem.item_id === item.item_id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...currentCart, { ...item, quantity: 1 }];
            }
        });
    };
    const handleManualQuantity = (item, text) => {
        if (text === '') {
            setCart(prev => prev.map(c => c.item_id === item.item_id ? { ...c, quantity: '' } : c));
            return;
        }
        const qty = parseInt(text, 10);
        if (isNaN(qty)) return;
        if (qty > item.stock) {
            const limitMsg = `You cannot add ${qty} ${item.item_name}. Only ${item.stock} left in stock.`;
            if (Platform.OS === 'web') {
                window.alert(limitMsg);
            } else {
                Alert.alert("Stock Limit Reached", limitMsg);
            }
            setCart(prev => prev.map(c => c.item_id === item.item_id ? { ...c, quantity: item.stock } : c));
            return;
        }
        if (qty <= 0) {
            setCart(prev => prev.filter(c => c.item_id !== item.item_id));
            return;
        }
        setCart(prev => prev.map(c => c.item_id === item.item_id ? { ...c, quantity: qty } : c));
    };
    const removeFromCart = (itemId) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.item_id === itemId);
            if (existingItem.quantity === 1) {
                return currentCart.filter(cartItem => cartItem.item_id !== itemId);
            } else {
                return currentCart.map(cartItem => 
                    cartItem.item_id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                );
            }
        });
    };
    const grandTotal = cart.reduce((sum, item) => sum + (item.sale_rate * item.quantity), 0);
    const handleProceedClick = async () => {
        fetchCustomers();
        console.log("Fetching Successful: ")
        setCustomerModalVisible(true);
    };
    const handleCustomerSelect = (customerData) => {
        let fullCustomerObj = null;
        if (typeof customerData === 'object' && customerData !== null) {
            fullCustomerObj = customerData;
        } else {
            fullCustomerObj = customers.find(c => String(c.customer_id) === String(customerData));
        }
        setSelectedCustomerInfo(fullCustomerObj);
        setCustomerModalVisible(false);
        setTimeout(() => {
            if (fullCustomerObj) {
                setConfirmationVisible(true);
            } else {
                Alert.alert("Error", "Could not load customer details.");
            }
        }, 300);
    };
    const executeSale = async () => {
        setConfirmationVisible(false);
        setLoading(true);
        
        const formattedItems = cart.map(item => {
            const amount = item.sale_rate * item.quantity;
            return {
                item_id: item.item_id,
                sale_rate: item.sale_rate,
                quantity: item.quantity,
                tax_amount: amount * (item.gst_percentage / 100),
                amount: amount
            };
        });
        const checkoutData = {
            customer_id: selectedCustomerInfo.customer_id,
            items: formattedItems,
            total_tax_amount: formattedItems.reduce((sum, item) => sum + item.tax_amount, 0),
            grand_total: grandTotal,
            payment_method: "UPI"
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(`${API_URL}/checkout`, checkoutData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const generatedInvoiceNumber = response.data.invoice_number;
            if (Platform.OS === 'web') {
                const wantsToDownload = window.confirm(
                    `Payment Successful!\n\nInvoice ${generatedInvoiceNumber} has been saved.\n\nClick "OK" to Download/Print the PDF, or "Cancel" to start a new bill.`
                );
                if (wantsToDownload) {
                    generateInvoicePDF(cart, selectedCustomerInfo, grandTotal, generatedInvoiceNumber);
                }
                clearCartAndReset();
                } else {
                    
                    Alert.alert(
                        'Payment Successful!',
                        `Invoice ${generatedInvoiceNumber} has been saved. Do you want to download the PDF?`,
                        [
                            { text: "No, Start New Bill", style: "cancel", onPress: () => clearCartAndReset() },
                            { text: "Yes, Download PDF", onPress: () => {
                                generateInvoicePDF(cart, selectedCustomerInfo, grandTotal, generatedInvoiceNumber);
                                clearCartAndReset();
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Checkout Failed', 'Could not process the transaction.');
        } finally {
            setLoading(false);
        }
    };

    const clearCartAndReset = () => {
        setCart([]);
        setSelectedCustomerInfo(null);
        fetchInventory();
    };

    const handleCheckout = async (selectedCustomerId) => {
        const formattedItems = cart.map(item => {
            const amount = item.sale_rate * item.quantity;
            const taxAmount = amount * (item.gst_percentage / 100);
            return {
                item_id: item.item_id,
                sale_rate: item.sale_rate,
                quantity: item.quantity,
                tax_amount: taxAmount,
                amount: amount
            };
        });
        const totalTax = formattedItems.reduce((sum, item) => sum + item.tax_amount, 0);
        const checkoutData = {
            customer_id: selectedCustomerId,
            items: formattedItems,
            total_tax_amount: totalTax,
            grand_total: grandTotal,
            payment_method: "UPI"
        };
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(`${API_URL}/checkout`, checkoutData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart([]);
            fetchInventory(); 
            Alert.alert('Payment Successful!', `Invoice: ${response.data.invoice_number}`);
        } catch (error) {
            console.error("Checkout Error:", error);
            Alert.alert('Checkout Failed', 'Could not process the transaction.');
        } finally {
            setLoading(false);
        }
    };
    const filteredInventory = inventory.filter(item => 
        item.item_name.toLowerCase().includes(itemSearchText.toLowerCase())
    );
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
            </View>
            
            <View style={styles.titleRow}>
                <Text style={styles.pageTitle}>New Bill</Text>
                <TouchableOpacity style={styles.cartIconBtn} onPress={() => setIsCartVisible(true)}>
                    <Text style={{ fontSize: 32 }}>🛒</Text>
                    {cart.length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cart.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <SearchBar 
                    placeholder="Search items by name..." 
                    value={itemSearchText}
                    onChangeText={setItemSearchText}
                    containerStyle={{ marginHorizontal: 20, marginVertical: 15 }} 
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#2c2c4d" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredInventory}
                    keyExtractor={(item) => item.item_id.toString()}
                    contentContainerStyle={{ paddingBottom: 150 }} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const cartItem = cart.find(c => c.item_id === item.item_id);
                        const quantityInCart = cartItem ? cartItem.quantity : 0;
                        return (
                            <ItemCard 
                                item={{
                                    name: item.item_name,
                                    description: `Stock: ${item.stock} ${item.unit || ''} | ₹${item.sale_rate}`,
                                    // Use database images if available, otherwise placeholders
                                    image_url: item.image_url ? { uri: item.image_url } : null,
                                    barcode_url: item.barcode_url ? { uri: item.barcode_url } : null
                                }} 
                                quantity={quantityInCart}
                                onAdd={() => addToCart(item)}
                                onRemove={() => removeFromCart(item.item_id)}
                            />
                        );
                    }}
                    ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No items found.</Text>}
                />
            )}
            <Modal visible={isCartVisible} animationType="fade" transparent={true}>
                <TouchableOpacity 
                    style={styles.cartOverlay} 
                    activeOpacity={1} 
                    onPress={() => setIsCartVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.sideCartPanel}>
                        <View style={styles.sideCartHeader}>
                            <Text style={styles.sideCartTitle}>Cart Items</Text>
                            <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                                <Text style={styles.closeCartIcon}>✖</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sideCartTitle}>Cart Items</Text>
                        
                        <FlatList 
                            data={cart}
                            keyExtractor={(item) => item.item_id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.sideCartItem}>
                                    
                                    <View style={styles.sideCartItemTop}>
                                        <Text style={styles.sideCartItemName}>{item.item_name}</Text>
                                        <Text style={styles.sideCartItemPrice}>₹{item.sale_rate * (Number(item.quantity) || 0)}</Text>
                                    </View>
                                    
                                    <View style={styles.sideCartItemBottom}>
                                        <Text style={styles.sideCartQtyLabel}>Quantity:</Text>
                                        
                                        {/* Manual Text Box Controls */}
                                        <View style={styles.qtyControlRow}>
                                            <TouchableOpacity 
                                                style={styles.smallQtyBtn} 
                                                onPress={() => handleManualQuantity(item, String((Number(item.quantity) || 0) - 1))}
                                            >
                                                <Text style={styles.smallQtyText}>-</Text>
                                            </TouchableOpacity>
                                            
                                            <TextInput 
                                                style={styles.smallQtyInput}
                                                keyboardType="numeric"
                                                value={String(item.quantity)}
                                                onChangeText={(text) => handleManualQuantity(item, text)}
                                                selectTextOnFocus={true}
                                            />
                                            
                                            <TouchableOpacity 
                                                style={styles.smallQtyBtn} 
                                                onPress={() => handleManualQuantity(item, String((Number(item.quantity) || 0) + 1))}
                                            >
                                                <Text style={styles.smallQtyText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyCartText}>No items added yet.</Text>}
                        />
                        {cart.length > 0 && (
                            <View style={styles.sideCartFooter}>
                                <Text style={styles.sideCartTotalText}>Total: ₹{grandTotal.toFixed(2)}</Text>
                                <TouchableOpacity 
                                    style={styles.proceedBtn} 
                                    onPress={() => {
                                        setIsCartVisible(false); // Close modal first
                                        handleProceedClick();    // Then open customer modal
                                    }}
                                >
                                    <Text style={styles.proceedBtnText}>Proceed</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <Modal visible={isCustomerModalVisible} animationType="slide" transparent={false}>
                <CustomerPanel 
                    customers={customers} 
                    onSelectCustomer={handleCustomerSelect} 
                    onClose={() => setCustomerModalVisible(false)}
                    refreshCustomers={fetchCustomers}
                />
            </Modal>
            <InvoiceConfirmationModal 
                visible={isConfirmationVisible}
                cart={cart}
                customer={selectedCustomerInfo}
                grandTotal={grandTotal}
                onConfirm={executeSale}
                onCancel={() => setConfirmationVisible(false)}
            />
        </View>
    );
}