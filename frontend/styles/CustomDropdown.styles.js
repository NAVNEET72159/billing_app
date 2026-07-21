import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        zIndex: 100, 
    },
    dropdownTrigger: {
        backgroundColor: '#c4c1a5',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    selectedValue: {
        color: '#000',
        fontSize: 15,
    },
    placeholder: {
        color: '#666',
        fontSize: 15,
    },
    arrow: {
        color: '#333',
        fontSize: 12,
    },
    dropdownMenu: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    createNewBtn: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
    },
    createNewText: {
        fontSize: 16,
        color: '#66a23f',
        fontWeight: 'bold',
    }
});