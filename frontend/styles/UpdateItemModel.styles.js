import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalContent: { 
        backgroundColor: '#fff', 
        width: '90%', 
        borderRadius: 12, 
        padding: 20 
    },
    headerTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
        color: '#000' 
    },
    label: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 5 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 15, 
        fontSize: 16, 
        color: '#000' 
    },
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 10 },
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
    saveBtn: { 
        backgroundColor: '#7cb342' 
    }, 
    saveBtnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});