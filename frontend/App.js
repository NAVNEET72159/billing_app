import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './screens/loginScreen';
import DashboardScreen from './screens/dashboardScreen';
import NewBillScreen from './screens/newBillScreen';
import InventoryScreen from './screens/InventoryScreens';
import CustomerScreen from './screens/CustomerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* The first screen listed is the one that loads first */}
        <Stack.Screen name="Login" component={LogInScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="NewBill" component={NewBillScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Customers" component={CustomerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
