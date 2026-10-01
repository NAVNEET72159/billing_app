import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end', // 🚀 THIS FIXES THE LAYOUT GLITCH
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        width: Platform.OS === 'web' ? 450 : '85%', 
        backgroundColor: '#f8f9fa',
        height: '100%',
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        display: 'flex',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: Platform.OS === 'web' ? 0 : 40, // Adds safe space for mobile notch
    },
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
    input: { 
        backgroundColor: '#c4c0b3', 
        borderRadius: 25, 
        paddingHorizontal: 15, 
        paddingVertical: 12, 
        marginBottom: 15, 
        fontSize: 16, 
        color: '#000' 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    codeColumn: { 
        width: '30%' 
    },
    phoneColumn: { 
        width: '65%' 
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
    }, // Red cancel
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