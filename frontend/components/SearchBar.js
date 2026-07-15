import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../styles/SearchBar.styles';

export default function SearchBar({ placeholder, value, onChangeText, containerStyle }) {
    return (
        <View style={[styles.searchContainer, containerStyle]}>
            <Image source={require('../assets/images/search.png')} style={styles.icon} />
            <TextInput 
                style={styles.searchInput}
                placeholder={placeholder || "Search..."}
                placeholderTextColor="#a0a0a0"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}