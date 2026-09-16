import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import styles from '../styles/BottomNav.styles';

export default function BottomNav({ navigation }) {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                <Image source={require('../assets/images/home.png')} style={styles.navIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                <Image source={require('../assets/images/report.png')} style={styles.navIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={require('../assets/images/profile.png')} style={styles.navIcon} />
            </TouchableOpacity>
        </View> 
    );
}