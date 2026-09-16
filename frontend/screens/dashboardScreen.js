import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions, DeviceEventEmitter, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import styles from '../styles/DashboardScreen.styles';

export default function DashboardScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    
    // 🚀 Dynamic Greeting State
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleLogout = async () => {
        DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');    
    };

    // 🚀 Note the new `highlight: true` on the New Bill item
    const menuItems = [
        { id: 1, title: 'New Bill', image: require('../assets/images/bill_invoice.png'), route: 'NewBill', highlight: true },
        { id: 2, title: 'Inventory', image: require('../assets/images/inventory.png'), route: 'Inventory' },
        { id: 3, title: 'Customer', image: require('../assets/images/users.png'), route: 'Customers' },
        { id: 4, title: 'Reports', image: require('../assets/images/report.png'), route: 'Reports' },
        { id: 5, title: 'Barcode', image: require('../assets/images/barcode.png'), route: 'Barcode' },
        { id: 6, title: 'Invoices', image: require('../assets/images/invoice-bill.png'), route: 'Invoice'},
        { id: 7, title: 'Raw Material', image: require('../assets/images/raw.png'), route: 'RawMaterial' },
        { id: 8, title: 'Production', image: require('../assets/images/factory.png'), route: 'Production' },
        { id: 9, title: 'Log Book', image: require('../assets/images/log-book.png'), route: 'LogBook' }
    ];

    const handleNavigation = (route) => {
        navigation.navigate(route); 
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Header rightIcon="log-out-outline" onIconPress={handleLogout} />
            
            {/* Added flex: 1 so the ScrollView doesn't push the BottomNav off-screen */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* 🚀 Sleek Hero Banner Section */}
                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.greetingText}>{greeting}, Navneet 👋</Text>
                        <Text style={styles.dashboardSubtitle}>What would you like to manage today?</Text>
                    </View>
                </View>

                {/* 🚀 Upgraded Floating Grid Section */}
                <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
                    {menuItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            activeOpacity={0.7}
                            style={[
                                styles.card, 
                                isDesktop && styles.cardDesktop,
                                item.highlight && styles.highlightCard // Injects dark theme for New Bill
                            ]}
                            onPress={() => handleNavigation(item.route)}
                        >
                            <View style={[styles.iconContainer, item.highlight && styles.highlightIconContainer]}>
                                <Image source={item.image} style={styles.cardIcon} resizeMode="contain" />
                            </View>
                            <Text style={[styles.cardText, item.highlight && styles.highlightCardText]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 🕵️‍♂️ Hidden Signature Mark */}
                <Text style={styles.signatureText}>Created by Shandilya Enterprises</Text>

            </ScrollView>
            
            <BottomNav navigation={navigation} />
        </View>
    );
}