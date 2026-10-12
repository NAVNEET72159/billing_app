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
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
    floatingCartWrapper: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center', // Centers the button horizontally
        zIndex: 10,
    },
    floatingCartBtn: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a', // Sleek dark theme
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    floatingCartLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBadge: {
        backgroundColor: '#00D26A',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cartBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    floatingCartTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    floatingCartTotal: {
        color: '#00D26A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    heroBanner: {
        backgroundColor: '#00D26A', 
        padding: 20,
        paddingTop: Platform.OS === 'web' ? 40 : 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#00D26A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    heroHeader: {
        marginBottom: 15,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    pageSubtitle: {
        fontSize: 15,
        color: '#e8f5e9',
        fontWeight: '500',
        marginTop: 5,
    },
    searchContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    /* 🚀 THE MISSING FLOATING BUTTON STYLES */
    floatingCartWrapper: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? 40 : 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    floatingCartBtn: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a', 
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30,
        width: Platform.OS === 'web' ? 400 : '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    floatingCartLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBadge: {
        backgroundColor: '#00D26A',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cartBadgeText: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 18,
    },
    floatingCartTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    floatingCartTotal: {
        color: '#00D26A',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    }
});