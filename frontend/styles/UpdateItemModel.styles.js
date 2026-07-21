import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
        paddingTop: 50 
    },
    headerTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#000', 
        paddingHorizontal: 20, 
        marginBottom: 15 
    },
    scrollContent: { 
        paddingHorizontal: 20, 
        paddingBottom: 40 
    },
    staticText: { 
        fontSize: 14, 
        color: '#333', 
        marginBottom: 20, 
        marginLeft: 5 
    },
    label: { 
        fontSize: 14, 
        color: '#000', 
        marginLeft: 10, 
        marginBottom: 5 
    },
    stockHighlightBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#90caf9'
    },
    currentStockText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1565c0',
        textAlign: 'center'
    },

    input: { 
        backgroundColor: '#c4c0b3', 
        borderRadius: 25, 
        paddingHorizontal: 15, 
        paddingVertical: 12, 
        marginBottom: 15, 
        fontSize: 16, 
        color: '#000' 
    },
    
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 10 
    },
    btn: { 
        flex: 1, 
        paddingVertical: 15, 
        borderRadius: 25, 
        alignItems: 'center', 
        marginHorizontal: 5 
    },
    cancelBtn: { 
        backgroundColor: '#e53935' 
    },
    cancelBtnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    submitBtn: { 
        backgroundColor: '#7cb342' 
    },
    submitBtnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});