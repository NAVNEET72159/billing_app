import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/Header.styles';
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Header({ rightIcon, onIconPress }) {
    const navigation = useNavigation();
    const route = useRoute();
    const noBackButtonScreens = ['Login', 'Dashboard'];
    const shouldShowBack = navigation.canGoBack() && !noBackButtonScreens.includes(route.name);
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