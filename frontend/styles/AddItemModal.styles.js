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
        marginBottom: 10 
    },
    scrollContent: { 
        paddingHorizontal: 20, 
        paddingBottom: 40 
    },
    staticText: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#000', 
        marginBottom: 15 
    },
    label: { 
        fontSize: 14, 
        color: '#333', 
        marginLeft: 10, 
        marginBottom: 5 
    },
    input: { 
        backgroundColor: '#e0e0e0', 
        borderRadius: 25, 
        paddingHorizontal: 15, 
        paddingVertical: 12, 
        marginBottom: 15, 
        fontSize: 16, 
        color: '#000' 
    },    
    barcodeButtonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    barcodeBtn: { 
        backgroundColor: '#7cb342',
        borderRadius: 20, 
        paddingVertical: 10, 
        paddingHorizontal: 15,
        width: '48%',
        alignItems: 'center'
    },
    barcodeBtnText: { 
        color: '#000', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 20 
    },
    btn: { 
        flex: 1, 
        paddingVertical: 15, 
        borderRadius: 25, 
        alignItems: 'center', 
        marginHorizontal: 5 
    },
    cancelBtn: { 
        backgroundColor: '#ccc' 
    },
    cancelBtnText: { 
        color: '#000', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    submitBtn: { 
        backgroundColor: '#2c2c4d' 
    },
    submitBtnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }, 
    groupModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed background
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupModalContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 25, // Highly rounded corners matching the UI
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    groupModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    groupModalLabelBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    groupModalLabel: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 5,
    },
    groupModalInput: {
        backgroundColor: '#C8BAA7', // Khaki/Beige exact match
        borderRadius: 20, // Fully rounded pill shape
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    groupModalBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    groupModalCancelBtn: {
        backgroundColor: '#DE3931', // Red match
        flex: 0.48,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
    },
    groupModalSubmitBtn: {
        backgroundColor: '#7DBA45', // Green match
        flex: 0.48,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
    },
    groupModalBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});