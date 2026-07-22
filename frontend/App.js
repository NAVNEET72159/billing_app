import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { View, ActivityIndicator, PanResponder, Platform, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './screens/loginScreen';
import DashboardScreen from './screens/dashboardScreen';
import NewBillScreen from './screens/newBillScreen';
import InventoryScreen from './screens/InventoryScreens';
import CustomerScreen from './screens/CustomerScreen';
import BarcodeGeneratorScreen from './screens/BarcodeGeneratorScreen';
import InvoiceScreen from './screens/InvoicesScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const inactivityTimer = useRef(null);
  const INACTIVITY_LIMIT = 30 * 60 * 1000;
  const handleLogout = async (message) => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      alert(message);
    }
  };
  const resetInactivityTimeout = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      handleLogout("Session expired due to inactivity. Please log in again.");
    }, INACTIVITY_LIMIT);
  };
  const panResponder = useRef(
    PanResponder.create({
      // This captures ANY touch on the entire screen
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
        return false; // Return false so we don't block the actual button clicks!
      },
    })
  ).current;
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
          resetInactivityTimeout();
        }
      } catch (e) {
      console.error("Failed to restore token");
      }
      setIsLoading(false); // Stop the loading spinner
    };
    checkExistingLogin();
    const interceptor = axios.interceptors.response.use(
      (response) => response, // If request is successful, just pass it through
      async (error) => {
        // If the backend says the JWT token expired (401 Unauthorized)
        if (error.response && error.response.status === 401) {
          await handleLogout("Your security token expired. Please log in again.");
        }
        return Promise.reject(error);
      }
    );
    const logoutListener = DeviceEventEmitter.addListener('triggerGlobalLogout', (msg) => {
      handleLogout(msg || "Successfully logged out.");
    });
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      axios.interceptors.response.eject(interceptor);
      logoutListener.remove();
    };
  },  []);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2c2c4d" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken ? (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="NewBill" component={NewBillScreen} />
              <Stack.Screen name="Inventory" component={InventoryScreen} />
              <Stack.Screen name="Customers" component={CustomerScreen} />
              <Stack.Screen name="Barcode" component={BarcodeGeneratorScreen} />
              <Stack.Screen name='Invoice' component={InvoiceScreen} />
            </>
          ) : (
            <Stack.Screen name="Login">
              {(props) => <LogInScreen {...props} setToken={setUserToken} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
