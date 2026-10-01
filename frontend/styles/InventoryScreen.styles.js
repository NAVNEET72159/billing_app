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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    },
    heroHeader: {
        marginBottom: 15,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
        flex: 1,
        marginRight: 15,
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
    }
});