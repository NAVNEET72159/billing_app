import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    headerWrapper: { marginBottom: 10 },
    pageTitle: { fontSize: 28, fontWeight: '900', color: '#000000', paddingHorizontal: 20, marginBottom: 20 },
    
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    displayCard: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#333333',
        borderRadius: 12,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    barcodeContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    barcodeVisualizer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 100,
        marginBottom: 10,
    },
    barcodeLine: {
        backgroundColor: '#000000',
        height: '100%',
    },
    barcodeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'monospace',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
        marginBottom: 5,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: '#999999',
    },
    controlsContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 20,
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        letterSpacing: 2,
        fontWeight: 'bold'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    btn: {
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    generateBtn: {
        backgroundColor: '#7cb342',
        flex: 0.65,
        marginRight: 10,
    },
    generateBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearBtn: {
        backgroundColor: '#e53935',
        flex: 0.3,
    },
    clearBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveBtn: {
        backgroundColor: '#2c2c4d',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    saveBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '900',
    }
});