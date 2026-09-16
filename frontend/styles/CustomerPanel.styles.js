import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Enforces soft gray background
    },
    
    // --- HERO BANNER ---
    heroBanner: {
        backgroundColor: '#00D26A', // Enforces vibrant green!
        paddingTop: 25,
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
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF', // Forces text to white against the green
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#E6FFF2',
        fontWeight: '600',
        marginTop: 4,
    },
    
    // --- SEARCH BAR & NEW BUTTON ---
    searchWrapper: {
        paddingHorizontal: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15, 
    },
    searchContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 15,
        borderWidth: 0,
        height: 50,
        justifyContent: 'center',
        marginRight: Platform.OS === 'web' ? 0 : 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    newButton: {
        backgroundColor: '#1E1E1E', // Dark high-contrast button
        height: 50,
        paddingHorizontal: 25,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    newButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 0.5,
    },

    // --- LIST STYLES ---
    listContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: 'bold',
    },

    // --- FLOATING CARDS ---
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    cardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: '#E5E7EB',
        borderBottomWidth: 0,
    },
    cardHeader: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 12,
    },
    customerName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F2937', // Dark slate text
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    },
    cardDetails: {
        gap: 8, 
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
    },
    iconText: {
        fontSize: 14,
    },

    // --- EXPANDED ACTIONS ---
    actionRow: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    updateBtn: {
        flex: 1,
        backgroundColor: '#EEF2FF', // Soft modern blue
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1.5,
        borderRightColor: '#E5E7EB',
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#FEF2F2', // Soft red
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontWeight: '900',
        fontSize: 13,
        color: '#1F2937',
        letterSpacing: 0.5,
    }
});