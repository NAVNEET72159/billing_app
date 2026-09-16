import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    groupModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupModalContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    groupModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c2c4d',
        marginBottom: 15,
    },
    groupModalLabelBold: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    groupModalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    groupModalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    groupModalBtnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    groupModalCancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    groupModalSubmitBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#2c2c4d',
        minWidth: 100,
        alignItems: 'center',
    },
    groupModalBtnText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
    },
});