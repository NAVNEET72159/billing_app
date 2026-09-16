import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    // Highlights the card beautifully when the item is in the cart
    cardActive: {
        borderColor: '#00D26A',
        backgroundColor: '#F2FDF7', 
    },
    
    // --- IMAGE STYLES ---
    imageWrapper: {
        width: 65,
        height: 65,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
        marginRight: 15,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },

    // --- TEXT DETAILS ---
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937', // Dark gray
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    },
    itemDescription: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

    // --- BUTTONS & CONTROLS ---
    actionContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 10,
        minWidth: 80, // Prevents layout shifting when switching from ADD to Qty controls
    },
    
    // Default "ADD" Button
    addBtn: {
        backgroundColor: '#EEF2FF', // Soft modern blue
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20, // Pill shape
    },
    addBtnText: {
        color: '#1565C0', // Strong blue text
        fontWeight: '900',
        fontSize: 13,
        letterSpacing: 0.5,
    },

    // Active "Quantity" Pill
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00D26A', // Vibrant Green
        borderRadius: 20,
        height: 36,
        paddingHorizontal: 5,
        shadowColor: '#00D26A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    qtyBtn: {
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyBtnTextMinus: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -2, 
    },
    qtyBtnTextPlus: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: -1,
    },
    qtyTextWrapper: {
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    }
});