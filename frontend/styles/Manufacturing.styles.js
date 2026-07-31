import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    backArrow: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        paddingHorizontal: 25,
        paddingBottom: 50,
    },
    staticText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
        marginLeft: 5,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#BCAE9B',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
        marginBottom: 15,
    },
    generateBtn: {
        backgroundColor: '#8CC63F',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    generateBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    submitBtn: {
        backgroundColor: '#7DBA45',
        flex: 0.48,
        borderRadius: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#ff1a1a',
        flex: 0.48,
        borderRadius: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
    }
});