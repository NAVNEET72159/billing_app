import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/ItemCard.styles';

export default function ItemCard({ item, quantity, onAdd, onRemove }) {
    
    const getValidImage = (imgProp) => {
        if (!imgProp) return require('../assets/images/image_unavailable.png');
        if (typeof imgProp === 'string') return { uri: imgProp };
        return imgProp; // Returns as-is if it's already formatted as { uri: '...' }
    };

    return (
        <View style={styles.cardContainer}>
            
            {/* 📸 Safely load the product photo */}
            <Image 
                source={getValidImage(item.image_url)} 
                style={styles.itemImage} 
            />
            
            <View style={styles.detailsContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                
                {/* 📸 Safely load the barcode (if you want to hide the unavailable image when no barcode exists, you can wrap this in a conditional!) */}
                <Image 
                    source={getValidImage(item.barcode_url)} 
                    style={styles.barcodeImage} 
                />
            </View>
            
            <View style={styles.actionContainer}>
                {quantity > 0 ? (
                    <View style={styles.qtyControl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={onAdd}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
            
                        <Text style={styles.qtyText}>{quantity}</Text>
            
                        <TouchableOpacity style={styles.qtyBtn} onPress={onRemove}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
                        <Text style={styles.addBtnText}>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}