import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, Image, ScrollView, useWindowDimensions, DeviceEventEmitter } from 'react-native';
import styles from '../styles/DashboardScreen.styles';

export default function DashboardScreen({ navigation }) {
        const { width } = useWindowDimensions();
        const isDesktop = width > 768;
        const handleLogout = async () => {
            DeviceEventEmitter.emit('triggerGlobalLogout', 'You have securely logged out.');    
        };
    const menuItems = [
        { id: 1, title: 'New Bill', image: require('../assets/images/bill_invoice.png'), route: 'NewBill' },
        { id: 2, title: 'Inventory', image: require('../assets/images/inventory.png'), route: 'Inventory' },
        { id: 3, title: 'Customer', image: require('../assets/images/users.png'), route: 'Customers' },
        { id: 4, title: 'Reports', image: require('../assets/images/report.png'), route: 'Reports' },
        { id: 5, title: 'Barcode Generator', image: require('../assets/images/barcode.png'), route: 'Barcode' },
        { id: 6, title: 'Invoice Screen', image: require('../assets/images/invoice-bill.png'), route: 'Invoice'},
        { id: 7, title: 'Raw Material', image: require('../assets/images/raw.png'), route: 'RawMaterial' },
        { id: 8, title: 'Production', image: require('../assets/images/factory.png'), route: 'Production' },
        { id: 9, title: 'Log Book', image: require('../assets/images/log-book.png'), route: 'LogBook' }
    ];
    const handleNavigation = (route) => {
        // This one line handles every single route dynamically!
        navigation.navigate(route); 
    };
    return (
        <View style={styles.container} >
            <StatusBar hidden={true} />
            <Header 
                rightIcon="log-out-outline" 
                onIconPress={handleLogout} 
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.dashboardTitle}>DASHBOARD</Text>
                    <Text style={styles.dashboardSubtitle}>Select an action to continue</Text>
                </View>
                <View style={[styles.gridContainer, isDesktop && { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}]}>
                    {menuItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[styles.card, isDesktop && { width: 140, height: 140, padding: 10 }]}
                            onPress={() => handleNavigation(item.route)}
                        >
                            <Image source={item.image} style={[styles.cardIcon, isDesktop && { width: 60, height: 60 }]} />
                            <Text style={[styles.cardText, isDesktop && { fontSize: 18 }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <BottomNav navigation={navigation} />
        </View>
    );
}