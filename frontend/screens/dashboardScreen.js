import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/DashboardScreen.styles';
import InventoryScreen from './InventoryScreens';
import CustomerScreen from './CustomerScreen';

export default function DashboardScreen({ navigation }) {
        const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
    };
    const menuItems = [
        { id: 1, title: 'New Bill', image: require('../assets/images/bill_invoice.png'), route: 'NewBill' },
        { id: 2, title: 'Inventory', image: require('../assets/images/inventory.png'), route: 'Inventory' },
        { id: 3, title: 'Customer', image: require('../assets/images/users.png'), route: 'Customers' },
        { id: 4, title: 'Reports', image: require('../assets/images/report.png'), route: 'Reports' },
        { id: 5, title: 'Barcode Generator', image: require('../assets/images/barcode.png'), route: 'Barcode' },
    ];
    const handleNavigation = (route) => {
        if(route === 'NewBill') {
            navigation.navigate(route);
        } else  if(route === 'Inventory') {
            navigation.navigate(route);
        } else if(route === 'Customers') {
            navigation.navigate(route)
        }
    };
    return (
        <View style={styles.container} >
            <StatusBar hidden={true} />
            <Header 
                rightIcon="log-out-outline" 
                onIconPress={handleLogout} 
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.dashboardTitle}>DASHBOARD</Text>
                    <Text style={styles.dashboardSubtitle}>Select an action to continue</Text>
                </View>
                <View style={styles.gridContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.card}
                            onPress={() => handleNavigation(item.route)}
                        >
                            <Image source={item.image} style={styles.cardIcon} />
                            <Text style={styles.cardText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <BottomNav navigation={navigation} />
        </View>
    );
}