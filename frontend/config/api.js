import Constants from 'expo-constants';
import { Platform } from 'react-native';

let backendIP;

if (Platform.OS === 'web') {
    backendIP = window.location.hostname;
} else {
    const hostUri = Constants.expoConfig?.hostUri;
    
    if (hostUri) {
        backendIP = hostUri.split(':')[0]; 
    } else {
        backendIP = '10.0.2.2'; 
    }
}

export const API_URL = `https://your-vercel-app-url.vercel.app`;

console.log("🚀 Auto-Resolved API URL:", API_URL);