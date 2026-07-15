import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalContent: { 
        backgroundColor: '#fff', 
        width: '90%', 
        maxHeight: '80%', 
        borderRadius: 12, 
        padding: 20 
    },
    headerTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 15, 
        color: '#2c3e50' 
    },
    previewBox: { 
        backgroundColor: '#f9f9f9', 
        padding: 15, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#eee' 
    },
    previewHeader: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    previewSub: { 
        fontSize: 14, 
        color: '#666', 
        marginBottom: 10 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#ddd', 
        marginVertical: 10 
    },
    itemRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 10 
    },
    itemName: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#333' 
    },
    itemQty: { 
        fontSize: 13, 
        color: '#888' 
    },
    itemTotal: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    totalRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 5 
    },
    grandTotalText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    grandTotalAmount: { 
        fontSize: 20, 
        fontWeight: '900', 
        color: '#27ae60' 
    },
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 20 
    },
    btn: { 
        flex: 1, 
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginHorizontal: 5 
    },
    cancelBtn: { 
        backgroundColor: '#f5f5f5', 
        borderWidth: 1, 
        borderColor: '#ccc' 
    },
    cancelBtnText: { 
        color: '#333', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    confirmBtn: { 
        backgroundColor: '#2c2c4d' 
    },
    confirmBtnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});