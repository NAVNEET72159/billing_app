import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions, DeviceEventEmitter, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar'; // 🚀 IMPORT THE NEW SIDEBAR
import styles from '../styles/DashboardScreen.styles';

// 🚀 Grid Array kept in memory for the mobile layout
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
    const isDesktop = width > 768; // 🚀 Detects if user is on a computer
    
    const [greeting, setGreeting] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchRole = async () => {
            const role = await AsyncStorage.getItem('userRole');
            setUserRole(role || 'SALESPERSON'); 
        };
        fetchRole();
    }, []);

    const handleLogout = async () => {
        DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');    
    };

    const visibleMenuItems = menuItems.filter(item => item.allowedRoles.includes(userRole));
    const handleNavigation = (route) => navigation.navigate(route); 
    if (!userRole) return null;

    return (
        // 🚀 THE MAGIC LAYOUT WRAPPER: Turns into a row on desktop, column on mobile
        <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: '#f4f7f6' }}>
            <StatusBar hidden={true} />

            {/* 🚀 THE SIDEBAR: Automatically disappears on mobile phones */}
            <Sidebar navigation={navigation} currentRoute="Dashboard" />

            {/* 🚀 MAIN CONTENT AREA */}
            <View style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <Header rightIcon="log-out-outline" onIconPress={handleLogout} />
                
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.welcomeSection}>
                        <View>
                            <Text style={styles.greetingText}>{greeting}, Navneet 👋</Text>
                            <Text style={styles.dashboardSubtitle}>
                                {isDesktop ? 'Select a module from the left menu to begin.' : 'What would you like to manage today?'}
                            </Text>
                        </View>
                    </View>

                    {/* 🚀 QUICK ACTION GRID: Only visible on mobile, since web uses Sidebar */}
                    {!isDesktop && (
                        <View style={styles.gridContainer}>
                            {visibleMenuItems.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    activeOpacity={0.7}
                                    style={[styles.card, item.highlight && styles.highlightCard]}
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
                    )}

                    {!isDesktop && <Text style={styles.signatureText}>Created by Shandilya Enterprises</Text>}
                </ScrollView>
                
                {/* 🚀 BOTTOM NAV: Hidden on Desktop */}
                {!isDesktop && <BottomNav navigation={navigation} />}
            </View>
        </View>
    );
}