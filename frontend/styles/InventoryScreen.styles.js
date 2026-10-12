import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5'
    },
    headerWrapper: {
        marginBottom: 10,
    },
    pageTitle: { 
        fontSize: 28, 
        fontWeight: '900', 
        color: '#000000',
        paddingHorizontal: 20,
        marginBottom: 15
    },
    searchRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        marginBottom: 20 
    },
    searchContainer: { 
        flex: 1, 
        marginRight: 15,
    },
    newButton: { 
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    newButtonText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#000000' 
    },
    listContainer: { 
        paddingHorizontal: 20, 
        paddingBottom: 40 
    },
    card: { 
        backgroundColor: '#eaeaea',
        borderWidth: 1, 
        borderColor: '#333333', 
        flexDirection: 'row',
        padding: 12, 
        marginBottom: 12, 
        borderRadius: 4,
        alignItems: 'center'
    },
    cardDetails: { 
        flex: 1, 
        paddingRight: 10 
    },
    cardText: { 
        fontSize: 14, 
        color: '#333333', 
        marginBottom: 4 
    },
    boldLabel: { 
        fontWeight: 'bold', 
        color: '#000000' 
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90, 
    },
    imageContainer: {
        width: 80,
        height: 60,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden'
    },
    itemImage: {
        width: '100%',
        height: '100%'
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#63b3ed',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stockText: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    emptyText: {
        textAlign: 'center', 
        marginTop: 20,
        fontSize: 16,
        color: '#666'
    },
    cardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0, 
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10,
    },
    updateBtn: {
        flex: 1,
        backgroundColor: '#7cb342',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 5,
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#e53935',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginLeft: 5,
    },
    actionBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    heroBanner: {
        backgroundColor: '#00D26A', // 🚀 The New Bill Green Background!
        padding: 20,
        paddingTop: Platform.OS === 'web' ? 40 : 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#00D26A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    heroHeader: {
        marginBottom: 15,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff', // White text to pop on green
        letterSpacing: 0.5,
    },
    pageSubtitle: {
        fontSize: 15,
        color: '#e8f5e9', // Light green-white subtitle
        fontWeight: '500',
        marginTop: 5,
    },
    searchWrapper: {
        width: '100%',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    searchContainer: {
        backgroundColor: '#ffffff', // Crisp white search bar on green
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    newButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        },
    newButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardContentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLeft: {
        flex: 1,
        paddingRight: 15,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    priceGrid: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20, // Adds space between the price columns
    },
    priceColumn: {
        flexDirection: 'column',
    },
    priceLabel: {
        fontSize: 11,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    cardRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 8,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stockBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    stockText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    floatingCartWrapper: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? 40 : 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    floatingCartBtn: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a', // Premium dark button
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30,
        width: Platform.OS === 'web' ? 400 : '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    floatingCartLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBadge: {
        backgroundColor: '#00D26A',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cartBadgeText: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 18,
    },
    floatingCartTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    floatingCartTotal: {
        color: '#00D26A',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    }
});