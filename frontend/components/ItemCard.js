import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/ItemCard.styles';

export default function ItemCard({ item, quantity, onAdd, onRemove }) {
    return (
        <View style={styles.cardContainer}>
            <Image source={item.image_url || require('../assets/images/image_unavailable.png')} style={styles.itemImage} />
            <View style={styles.detailsContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Image source={item.barcode_url || require('../assets/images/image_unavailable.png')} style={styles.barcodeImage} />
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