import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    logo: { width: 60, height: 40, resizeMode: 'contain' },
    titleContainer: { flexDirection: 'row', alignItems: 'baseline' },
    letter: { fontSize: 20, fontWeight: '900' },
    posText: { fontSize: 20, fontWeight: '900', color: '#000000', marginLeft: 5 },
});

export default styles;