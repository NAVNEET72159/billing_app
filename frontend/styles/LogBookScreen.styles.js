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
        marginBottom: 20,
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    logCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        borderLeftWidth: 6,
        borderLeftColor: '#7DBA45',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c2c4d',
        flex: 1,
    },
    periodBadge: {
        backgroundColor: '#BCAE9B',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    periodText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    statValueDanger: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DE3931',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
        fontStyle: 'italic',
    }
});