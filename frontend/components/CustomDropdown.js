import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { styles } from '../styles/CustomDropdown.styles';

export default function CustomDropdown({ data, value, onSelect, onCreateNew, placeholder }) {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <View>
            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setIsVisible(true)}
            >
                <Text style={value ? styles.selectedValue : styles.placeholder}>
                    {value || placeholder || "Select a group..."}
                </Text>
                <Text style={styles.arrow}>{isVisible ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isVisible && (
                <View style={styles.dropdownMenu}>
                    {data && data.map((item, index) => (
                        <TouchableOpacity
                            key={index.toString()}
                            style={styles.dropdownItem}
                            onPress={() => {
                                onSelect(item);
                                setIsVisible(false);
                                }}
                        >
                            <Text style={styles.dropdownItemText}>
                                {item.name ? item.name : item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.createNewBtn}
                        onPress={() => {
                            setIsVisible(false);onCreateNew();
                        }}
                    >
                        <Text style={styles.createNewText}>+ Create New Group</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};