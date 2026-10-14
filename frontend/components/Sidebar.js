import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🚀 Array loaded once into memory
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

export default function Sidebar({ navigation, currentRoute }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            const role = await AsyncStorage.getItem('userRole');
            setUserRole(role || 'SALESPERSON');
        };
        fetchRole();
    }, []);

    // 🚀 If viewing on a mobile phone, hide the sidebar completely
    if (!isDesktop) return null;

    const visibleMenuItems = menuItems.filter(item => item.allowedRoles.includes(userRole));

    return (
        <View style={styles.sidebar}>
            {Platform.OS === 'web' && (
                <style type="text/css">{`
                    .sidebar-btn { transition: all 0.2s ease; }
                    .sidebar-btn:hover { background-color: #f0fdf4 !important; transform: translateX(5px); }
                `}</style>
            )}

            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>PYSSUM <Text style={{color: '#00D26A'}}>POS</Text></Text>
                <View style={styles.roleBadge}>
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
                            style={[styles.menuItem, isActive && styles.activeMenuItem]}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            <Image 
                                source={item.image} 
                                style={[styles.menuIcon, { tintColor: isActive ? '#00D26A' : '#666' }]} 
                                resizeMode="contain"
                            />
                            <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>© Shandilya Enterprises</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: 260,
        backgroundColor: '#ffffff',
        borderRightWidth: 1,
        borderRightColor: '#eeeeee',
        height: '100%',
        paddingVertical: 25,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 100, // Keeps shadow above the main content
    },
    logoContainer: {
        paddingHorizontal: 25,
        marginBottom: 30,
    },
    logoText: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    roleBadge: {
        backgroundColor: '#e8f5e9',
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
        backgroundColor: '#f0fdf4',
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
        color: '#666',
    },
    activeMenuText: {
        color: '#00D26A',
        fontWeight: '800',
    },
    footer: {
        paddingHorizontal: 25,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#aaa',
        fontWeight: '500',
    }
});