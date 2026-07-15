import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#c4bea9',
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        resizeMode: 'cover',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 15,
        alignItems: 'flex-start', 
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2,
    },
    itemDescription: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 10,
    },
    barcodeImage: {
        width: 120,
        height: 30,
        resizeMode: 'contain',
    },
    actionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    addBtn: {
        backgroundColor: '#2c2c4d', // Dark purple from your logo
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    qtyControl: {
        alignItems: 'center',
    },
    qtyBtn: {
        backgroundColor: '#ffffff',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c2c4d',
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    }
});

export default styles;