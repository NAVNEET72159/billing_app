import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    },
    backArrow: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Room for bottom nav
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    dropdownBtn: {
        backgroundColor: '#988f98', // The grey from your mockup
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownMenu: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: -20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 2,
    }
});

export const chartColors = ['#4a7bfa', '#bc8cfa', '#f5b364', '#fce062', '#ff6b6b', '#4ecdc4'];