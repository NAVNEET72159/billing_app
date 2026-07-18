import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9fb',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 700, 
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    logo: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    letter: {
        fontSize: 20,
        fontWeight: '900',
    },
    posText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000000',
        marginLeft: 5,
    },
    logoutButton: {
        padding: 5,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    dashboardTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1a1a2e',
        letterSpacing: 0.5,
    },
    dashboardSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 5,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        gap: 30,
    },
    card: {
        backgroundColor: '#f2f2f2',
        width: '48%',
        minWidth: 140,
        maxWidth: 160,
        aspectRatio: 1,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardIcon: {
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, 
    }
});

export default styles;