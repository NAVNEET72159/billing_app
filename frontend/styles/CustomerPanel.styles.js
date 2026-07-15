import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    panelContainer: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 50, 
        marginBottom: 15 
    },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#000000' 
    },
    closeIcon: { 
        width: 28, 
        height: 28, 
        tintColor: '#e74c3c' 
    },
    searchRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        marginBottom: 20 
    },
    newButton: { 
        paddingVertical: 10 
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
        padding: 15, 
        marginBottom: 15, 
        borderRadius: 4 
    },
    cardText: { 
        fontSize: 16, 
        color: '#333333', 
        marginBottom: 6 
    },
    boldLabel: { 
        fontWeight: 'bold', 
        color: '#000000' 
    }
});