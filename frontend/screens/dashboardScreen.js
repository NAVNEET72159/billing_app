import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions, DeviceEventEmitter, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🚀 Added AsyncStorage import
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import styles from '../styles/DashboardScreen.styles';

const menuItems = [
    { id: 1, title: 'New Bill', image: require('../assets/images/bill_invoice.png'), route: 'NewBill', highlight: true, allowedRoles: ['ADMIN', 'MANAGER', 'SALESPERSON'] },
    { id: 2, title: 'Inventory', image: require('../assets/images/inventory.png'), route: 'Inventory', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 3, title: 'Customer', image: require('../assets/images/users.png'), route: 'Customers', allowedRoles: ['ADMIN', 'MANAGER', 'SALESPERSON'] },
    { id: 4, title: 'Reports', image: require('../assets/images/report.png'), route: 'Reports', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 5, title: 'Barcode', image: require('../assets/images/barcode.png'), route: 'Barcode', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 6, title: 'Invoices', image: require('../assets/images/invoice-bill.png'), route: 'Invoice', allowedRoles: ['ADMIN', 'MANAGER', 'SALESPERSON'] },
    { id: 7, title: 'Raw Material', image: require('../assets/images/raw.png'), route: 'RawMaterial', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 8, title: 'Production', image: require('../assets/images/factory.png'), route: 'Production', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 9, title: 'Log Book', image: require('../assets/images/log-book.png'), route: 'LogBook', allowedRoles: ['ADMIN', 'MANAGER'] },
    { id: 10, title: 'Staff', image: require('../assets/images/users.png'), route: 'Staff', allowedRoles: ['ADMIN', 'MANAGER'] }
];

export default function DashboardScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    
    const [greeting, setGreeting] = useState('');
    const [userRole, setUserRole] = useState(null); // 🚀 NEW: State to hold the logged-in role

    useEffect(() => {
        // Set Greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // 🚀 NEW: Fetch the user's role from storage when Dashboard loads
        const fetchRole = async () => {
            try {
                const role = await AsyncStorage.getItem('userRole');
                setUserRole(role || 'SALESPERSON'); // Fallback to lowest permissions if empty
            } catch (error) {
                console.error("Failed to load role", error);
            }
        };
        fetchRole();
    }, []);

    const handleLogout = async () => {
        DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');    
    };

    // 🚀 NEW: Filter the grid so it only renders buttons this specific user is allowed to see
    const visibleMenuItems = menuItems.filter(item => item.allowedRoles.includes(userRole));

    const handleNavigation = (route) => {
        navigation.navigate(route); 
    };

    // Don't render the grid until we know the role, to prevent flashing restricted buttons
    if (!userRole) return null;

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Header rightIcon="log-out-outline" onIconPress={handleLogout} />
            
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.greetingText}>{greeting}, Navneet 👋</Text>
                        <Text style={styles.dashboardSubtitle}>What would you like to manage today?</Text>
                    </View>
                </View>

                <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
                    {/* 🚀 Changed from menuItems.map to visibleMenuItems.map */}
                    {visibleMenuItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            activeOpacity={0.7}
                            style={[
                                styles.card, 
                                isDesktop && styles.cardDesktop,
                                item.highlight && styles.highlightCard 
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

                <Text style={styles.signatureText}>Created by Shandilya Enterprises</Text>

            </ScrollView>
            
            <BottomNav navigation={navigation} />
        </View>
    );
}