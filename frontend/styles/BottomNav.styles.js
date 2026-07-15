import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    navIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});

export default styles;