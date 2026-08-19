import { StyleSheet, Platform } from 'react-native';

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
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
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
    },
    itemRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    returnItemBtn: {
        flex: 1,
        backgroundColor: '#e53935', // Red warning color for returns
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    returnItemText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    returnOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    returnContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
    },
    returnTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c2c4d',
        marginBottom: 10,
    },
    returnSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    returnInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    returnBtnRow: {
        flexDirection: 'row',
        gap: 10,
    },
    returnCancelBtn: {
        flex: 1,
        backgroundColor: '#999',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    returnConfirmBtn: {
        flex: 1,
        backgroundColor: '#e53935',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    returnBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    printBtn: {
        backgroundColor: '#7DBA45',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 10,
    },
    printBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    returnItemBtn: {
        flex: 1,
        backgroundColor: '#e53935', 
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    returnItemText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    returnOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    returnContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
    },
    returnTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c2c4d',
        marginBottom: 10,
    },
    returnSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    returnInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    returnBtnRow: {
        flexDirection: 'row',
        gap: 10,
    },
    returnCancelBtn: {
        flex: 1,
        backgroundColor: '#999',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    returnConfirmBtn: {
        flex: 1,
        backgroundColor: '#e53935',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    returnBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});