import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8F9FA' 
    },
    headerRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 20, 
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    backButton: { 
        marginRight: 15, 
        padding: 5 
    },
    backArrow: { 
        fontSize: 30, 
        color: '#2c2c4d', 
        lineHeight: 30 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#2c2c4d' 
    },
    tabContainer: { 
        flexDirection: 'row', 
        margin: 20, 
        backgroundColor: '#e8e6e1', 
        borderRadius: 8, 
        padding: 4 
    },
    tab: { 
        flex: 1, 
        paddingVertical: 10, 
        alignItems: 'center', 
        borderRadius: 6 
    },
    activeTab: { 
        backgroundColor: '#fff', 
        shadowColor: '#000', 
        shadowOffset: { 
            width: 0, 
            height: 1 
        }, 
        shadowOpacity: 0.1, 
        shadowRadius: 2, 
        elevation: 2 
    },
    tabText: { 
        fontSize: 16, 
        color: '#666', 
        fontWeight: 'bold' 
    },
    activeTabText: { 
        color: '#2c2c4d' 
    },
    actionRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    sectionSubtitle: { 
        fontSize: 16, 
        color: '#666', 
        fontWeight: 'bold' 
    },
    printBtn: { 
        backgroundColor: '#7DBA45', 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        borderRadius: 8 
    },
    printBtnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },

    card: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 12, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 3, 
        elevation: 2, 
        alignItems: 'center' 
    },
    itemName: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#2c2c4d', 
        marginBottom: 4 
    },
    itemDetail: { 
        fontSize: 14, 
        color: '#666' 
    },
    itemStock: { 
        fontSize: 18, 
        fontWeight: '900' 
    },
    monthBadge: { 
        backgroundColor: '#2c2c4d', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    monthText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    emptyText: { 
        textAlign: 'center', 
        color: '#888', 
        marginTop: 40, 
        fontSize: 16 
    }
});

export const chartColors = ['#4a7bfa', '#bc8cfa', '#f5b364', '#fce062', '#ff6b6b', '#4ecdc4'];