import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import styles from '../styles/Header.styles';
import { useNavigation, useRoute } from '@react-navigation/native';

// 🚀 Prevent the back arrow from showing on our primary root screens
const noBackButtonScreens = ['Login', 'Reports', 'Dashboard'];

export default function Header() {
    const navigation = useNavigation();
    const route = useRoute();
    const shouldShowBack = navigation.canGoBack() && !noBackButtonScreens.includes(route.name);

    // 🚀 NEW: This function talks directly to App.js to handle the secure logout globally
    const handleLogoutClick = () => {
        DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');
    };

    return (
        <View style={styles.header}>
            <View style={ styles.logocontainer }>
                {shouldShowBack ? (
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require('../assets/images/back.png')} style={styles.back}/>
                    </TouchableOpacity>
                ) : (
                    // An empty view keeps your logo perfectly centered if you are using flex-box
                    <View style={styles.placeholder} /> 
                )}
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>
            
            <View style={styles.titleContainer}>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>P</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>Y</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>S</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>S</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>U</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>M</Text>
                <Text style={styles.posText}>POS</Text>
            </View>

            {/* 🚀 NEW: The Logout button is now permanently attached to every header */}
            <TouchableOpacity onPress={handleLogoutClick}>
                <Image source={require('../assets/images/logout.png')} style={styles.logout} />
            </TouchableOpacity>
        </View>
    );
}