import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/Header.styles';
import { useNavigation, useRoute } from '@react-navigation/native';

const noBackButtonScreens = ['Login', 'Reports', 'Dashboard'];

export default function Header() {
    const navigation = useNavigation();
    const route = useRoute();
    const shouldShowBack = navigation.canGoBack() && !noBackButtonScreens.includes(route.name);

    // 🚀 NEW: State to track global theme inside the Header
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme === 'dark') setIsDarkMode(true);
        };
        loadTheme();

        const themeListener = DeviceEventEmitter.addListener('themeChanged', (newTheme) => {
            setIsDarkMode(newTheme === 'dark');
        });

        return () => {
            themeListener.remove();
        };
    }, []);

    const handleLogoutClick = () => {
        DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');
    };

    // 🚀 NEW: Dynamic text color for the logo
    const titleColor = isDarkMode ? '#ffffff' : '#2c3e50';

    return (
        <View style={styles.header}>
            <View style={styles.logocontainer}>
                {shouldShowBack ? (
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/images/back.png')} style={[styles.back, { tintColor: isDarkMode ? '#ffffff' : null }]}/>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} /> 
                )}
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>
            
            <View style={styles.titleContainer}>
                <Text style={[styles.letter, { color: titleColor }]}>P</Text>
                <Text style={[styles.letter, { color: titleColor }]}>Y</Text>
                <Text style={[styles.letter, { color: titleColor }]}>S</Text>
                <Text style={[styles.letter, { color: titleColor }]}>S</Text>
                <Text style={[styles.letter, { color: titleColor }]}>U</Text>
                <Text style={[styles.letter, { color: titleColor }]}>M</Text>
                <Text style={styles.posText}>POS</Text>
            </View>

            <TouchableOpacity onPress={handleLogoutClick}>
                <Image source={require('../assets/images/logout.png')} style={[styles.logout, { tintColor: isDarkMode ? '#ffffff' : null }]} />
            </TouchableOpacity>
        </View>
    );
}