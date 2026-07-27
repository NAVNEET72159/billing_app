import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    logocontainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        padding: 5,
        width: 40,
    },
    back: {
        width: 40,
        height: 40
    },
    placeholder: {
        width: 40,
    },
    logo: { 
        width: 120, 
        height: 100, 
        resizeMode: 'contain' 
    },
    titleContainer: { 
        flexDirection: 'row', 
        alignItems: 'baseline' 
    },
    letter: { 
        fontSize: 30, 
        fontWeight: '900' 
    },
    posText: { 
        fontSize: 30, 
        fontWeight: '900', 
        color: '#000000', 
        marginLeft: 5 
    },
    logout: { 
        width: 50, 
        height: 50, 
        resizeMode: 'contain' 
    },
});

export default styles;