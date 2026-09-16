import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import styles from '../styles/ItemCard.styles';
import { getValidImageUrl } from './utils/ImageHelper';

export default function ItemCard({ item, quantity, onAdd, onRemove }) {
    
    const resolveImage = (imgProp) => {
        if (!imgProp) return require('../assets/images/image_unavailable.png');
        const validUrl = getValidImageUrl(imgProp);
        return validUrl ? { uri: validUrl } : require('../assets/images/image_unavailable.png');
    };

    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            // Applies a subtle green border when the item is in the cart!
            style={[styles.cardContainer, quantity > 0 && styles.cardActive]} 
            onPress={onAdd}
        >
            <View style={styles.imageWrapper}>
                <Image source={resolveImage(item.image_url)} style={styles.itemImage} resizeMode="cover" />
            </View>
            
            <View style={styles.detailsContainer}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text>
            </View>
            
            <View style={styles.actionContainer}>
                {quantity > 0 ? (
                    <View style={styles.qtyControl}>
                        <TouchableOpacity 
                            style={styles.qtyBtn} 
                            onPress={onRemove}
                            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }} // Makes it easier to tap
                        >
                            <Text style={styles.qtyBtnTextMinus}>-</Text>
                        </TouchableOpacity>
            
                        <View style={styles.qtyTextWrapper}>
                            <Text style={styles.qtyText}>{quantity}</Text>
                        </View>
            
                        <TouchableOpacity 
                            style={styles.qtyBtn} 
                            onPress={onAdd}
                            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
                        >
                            <Text style={styles.qtyBtnTextPlus}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.addBtn} 
                        onPress={onAdd}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.addBtnText}>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}