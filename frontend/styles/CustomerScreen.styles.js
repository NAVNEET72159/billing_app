import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    headerWrapper: { marginBottom: 10 },
    pageTitle: { fontSize: 26, fontWeight: '900', color: '#000000', paddingHorizontal: 20, marginBottom: 15 },
    
    searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    searchContainer: { flex: 1, marginRight: 15 },
    newButton: { paddingVertical: 10, paddingHorizontal: 5 },
    newButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
    
    listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    card: { 
        backgroundColor: '#eaeaea', 
        borderWidth: 1, 
        borderColor: '#333333', 
        padding: 12, 
        borderRadius: 4 
    },
    cardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    cardDetails: { 
        flex: 1 
    },
    cardText: { 
        fontSize: 14, 
        color: '#333333', 
        marginBottom: 4 
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10,
    },
    updateBtn: {
        flex: 1,
        backgroundColor: '#7cb342', 
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 5,
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#e53935', 
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginLeft: 5,
    },
    actionBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' }
});