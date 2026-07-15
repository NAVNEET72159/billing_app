import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5'
    },
    headerWrapper: {
        marginBottom: 10,
    },
    pageTitle: { 
        fontSize: 28, 
        fontWeight: '900', 
        color: '#000000',
        paddingHorizontal: 20,
        marginBottom: 15
    },
    searchRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        marginBottom: 20 
    },
    searchContainer: { 
        flex: 1, 
        marginRight: 15,
    },
    newButton: { 
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    newButtonText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#000000' 
    },
    listContainer: { 
        paddingHorizontal: 20, 
        paddingBottom: 40 
    },
    card: { 
        backgroundColor: '#eaeaea',
        borderWidth: 1, 
        borderColor: '#333333', 
        flexDirection: 'row',
        padding: 12, 
        marginBottom: 12, 
        borderRadius: 4,
        alignItems: 'center'
    },
    cardDetails: { 
        flex: 1, 
        paddingRight: 10 
    },
    cardText: { 
        fontSize: 14, 
        color: '#333333', 
        marginBottom: 4 
    },
    boldLabel: { 
        fontWeight: 'bold', 
        color: '#000000' 
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90, 
    },
    imageContainer: {
        width: 80,
        height: 60,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden'
    },
    itemImage: {
        width: '100%',
        height: '100%'
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#63b3ed',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stockText: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    emptyText: {
        textAlign: 'center', 
        marginTop: 20,
        fontSize: 16,
        color: '#666'
    },
    cardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0, 
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
    }
});