import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const menuItems = [
    { id: 1, title: 'New Bill', image: require('../assets/images/bill_invoice.png'), route: 'NewBill', allowedRoles: ['ADMIN', 'MANAGER', 'SALESPERSON'] },
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

export default function Sidebar({ navigation, currentRoute }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const [userRole, setUserRole] = useState(null);
    
    // 🚀 NEW: Theme state management
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const fetchPreferences = async () => {
            const role = await AsyncStorage.getItem('userRole');
            setUserRole(role || 'SALESPERSON');
            
            // Load saved theme preference
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme === 'dark') setIsDarkMode(true);
        };
        fetchPreferences();
    }, []);

    if (!isDesktop) return null;

    const visibleMenuItems = menuItems.filter(item => item.allowedRoles.includes(userRole));

    // 🚀 NEW: Toggle function that saves to storage
    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
        
        // Note: To make the whole app dark, you would emit an event here 
        // to tell your other screens to update their colors too!
    };

    // 🚀 NEW: Dynamic Theme Colors
    const theme = {
        background: isDarkMode ? '#121212' : '#ffffff',
        border: isDarkMode ? '#333333' : '#eeeeee',
        textMain: isDarkMode ? '#ffffff' : '#1a1a1a',
        textMuted: isDarkMode ? '#aaaaaa' : '#666666',
        hoverBg: isDarkMode ? '#1e1e1e' : '#f0fdf4',
        activeBg: isDarkMode ? 'rgba(0, 210, 106, 0.15)' : '#f0fdf4',
    };

    return (
        <View style={[styles.sidebar, { backgroundColor: theme.background, borderRightColor: theme.border }]}>
            {Platform.OS === 'web' && (
                <style type="text/css">{`
                    .sidebar-btn { transition: all 0.2s ease; }
                    .sidebar-btn:hover { background-color: ${theme.hoverBg} !important; transform: translateX(5px); }
                `}</style>
            )}

            <View style={styles.logoContainer}>
                <Text style={[styles.logoText, { color: theme.textMain }]}>PYSSUM <Text style={{color: '#00D26A'}}>POS</Text></Text>
                <View style={[styles.roleBadge, { backgroundColor: isDarkMode ? '#00D26A20' : '#e8f5e9' }]}>
                    <Text style={styles.roleBadgeText}>{userRole}</Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                {visibleMenuItems.map((item) => {
                    const isActive = currentRoute === item.route;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            className="sidebar-btn"
                            style={[
                                styles.menuItem, 
                                isActive && [styles.activeMenuItem, { backgroundColor: theme.activeBg }]
                            ]}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            <Image 
                                source={item.image} 
                                style={[styles.menuIcon, { tintColor: isActive ? '#00D26A' : theme.textMuted }]} 
                                resizeMode="contain"
                            />
                            <Text style={[
                                styles.menuText, 
                                { color: isActive ? '#00D26A' : theme.textMuted },
                                isActive && styles.activeMenuText
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            <View style={[styles.footer, { borderTopColor: theme.border }]}>
                {/* 🚀 NEW: The Theme Toggle Button */}
                <TouchableOpacity style={[styles.themeToggleBtn, { borderColor: theme.border }]} onPress={toggleTheme}>
                    <Text style={[styles.themeToggleText, { color: theme.textMain }]}>
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </Text>
                </TouchableOpacity>
                
                <Text style={styles.footerText}>© Shandilya Enterprises</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: 260,
        borderRightWidth: 1,
        height: '100%',
        paddingVertical: 25,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 100, 
    },
    logoContainer: {
        paddingHorizontal: 25,
        marginBottom: 30,
    },
    logoText: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 5,
    },
    roleBadgeText: {
        color: '#00D26A',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    menuContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 4,
    },
    activeMenuItem: {
        borderRightWidth: 3,
        borderRightColor: '#00D26A',
    },
    menuIcon: {
        width: 22,
        height: 22,
        marginRight: 15,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
    },
    activeMenuText: {
        fontWeight: '800',
    },
    footer: {
        paddingHorizontal: 25,
        borderTopWidth: 1,
        paddingTop: 20,
    },
    themeToggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    themeToggleText: {
        fontSize: 13,
        fontWeight: '700',
    },
    footerText: {
        fontSize: 12,
        color: '#aaa',
        fontWeight: '500',
        textAlign: 'center'
    }
});