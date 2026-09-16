import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Soft gray background matching dashboard
    },
    
    // --- HERO BANNER ---
    heroBanner: {
        backgroundColor: '#00D26A', // Vibrant brand green
        paddingTop: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        shadowColor: '#00D26A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
        zIndex: 10,
    },
    heroHeader: {
        paddingHorizontal: 25,
        marginBottom: 15,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#E6FFF2',
        fontWeight: '600',
        marginTop: 2,
    },
    searchWrapper: {
        paddingHorizontal: 20,
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },

    // --- LIST STYLES ---
    listContent: {
        paddingTop: 20,
        paddingHorizontal: 15,
        paddingBottom: 120, // Extra padding so items don't hide behind the floating button
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: 'bold',
    },

    // --- 🚀 NEW: FLOATING CART BUTTON ---
    floatingCartWrapper: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 50,
    },
    floatingCartBtn: {
        backgroundColor: '#1E1E1E', // Dark theme matching the dashboard highlighted button
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        maxWidth: 450,
        paddingVertical: 16,
        paddingHorizontal: 25,
        borderRadius: 100, // Pill shape
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    floatingCartLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBadge: {
        backgroundColor: '#00D26A',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cartBadgeText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 14,
    },
    floatingCartTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    floatingCartTotal: {
        color: '#00D26A', // Green text pop
        fontSize: 18,
        fontWeight: '900',
    },

    // --- UPGRADED SIDE CART PANEL ---
    cartOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Darker background to make the drawer pop
        flexDirection: 'row',
    },
    sideCartPanel: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#F9FAFB',
        height: '100%',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: -10, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 15,
    },
    sideCartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
    },
    sideCartTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F2937',
    },
    closeCartBtn: {
        backgroundColor: '#F3F4F6',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeCartIcon: {
        fontSize: 24,
        color: '#6B7280',
        fontWeight: 'bold',
        marginTop: -3,
    },
    
    // --- CART ITEMS ---
    sideCartItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sideCartItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sideCartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
        paddingRight: 10,
    },
    sideCartItemPrice: {
        fontSize: 16,
        fontWeight: '900',
        color: '#00D26A',
    },
    sideCartItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sideCartQtyLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    qtyControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        overflow: 'hidden',
    },
    smallQtyBtn: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    smallQtyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    smallQtyInput: {
        width: 45,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        backgroundColor: '#F3F4F6',
        outlineStyle: 'none',
    },
    emptyCartText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },

    // --- CART FOOTER ---
    sideCartFooter: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    sideCartFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sideCartTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    sideCartTotalValue: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1F2937',
    },
    proceedBtn: {
        backgroundColor: '#1E1E1E', // Dark high-contrast action button
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    proceedBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});