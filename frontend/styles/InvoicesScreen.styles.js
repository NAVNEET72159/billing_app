import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    headerWrapper: {
        zIndex: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c2c4d',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    invoiceNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c2c4d',
    },
    grandTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7cb342',
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    boldLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    actionRow: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'flex-end',
    },
    deleteBtn: {
        backgroundColor: '#e53935',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    }, 
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c2c4d',
    },
    closeBtnText: {
        fontSize: 16,
        color: '#e53935',
        fontWeight: 'bold',
    },
    receiptInfoPanel: {
        padding: 20,
        backgroundColor: '#f9f9fb',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    receiptText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#e0e0e0',
    },
    tableHeaderText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    itemRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    colName: {
        flex: 2 
    },
    colQty: { 
        flex: 1, 
        textAlign: 'center' 
    },
    colRate: { 
        flex: 1, 
        textAlign: 'right' 
    },
    colTotal: { 
        flex: 1, 
        textAlign: 'right', 
        fontWeight: 'bold' 
    },
    itemText: { 
        fontSize: 14, 
        color: '#444' 
    }
});