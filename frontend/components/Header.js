import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/Header.styles';

export default function Header({ rightIcon, onIconPress }) {
    return (
        <View style={styles.header}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            
            <View style={styles.titleContainer}>
                <Text style={[styles.letter, { color: '#e74c3c' }]}>P</Text>
                <Text style={[styles.letter, { color: '#f1c40f' }]}>Y</Text>
                <Text style={[styles.letter, { color: '#8cc63f' }]}>S</Text>
                <Text style={[styles.letter, { color: '#8cc63f' }]}>S</Text>
                <Text style={[styles.letter, { color: '#e6ba9f' }]}>U</Text>
                <Text style={[styles.letter, { color: '#2c3e50' }]}>M</Text>
                <Text style={styles.posText}>POS</Text>
            </View>

            {onIconPress ? (
            <TouchableOpacity onPress={onIconPress}>
                <Image source={require('../assets/images/logout.png')} style={styles.logo} />
            </TouchableOpacity>
            ) : (
                <View style={styles.rightIcon} />
            )}
        </View>
    );
}