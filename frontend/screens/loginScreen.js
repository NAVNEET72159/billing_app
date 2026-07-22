import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreen.styles';
import { loginUser } from '../services/authServices';

export default function LogInScreen({ navigation, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    try {
      setLoading(true);
      const response = await loginUser(username, password);
      if (response && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        if (setToken) {
           setToken(response.token);
        }
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Network error. Is the server running?';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcome}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Image source={require('../assets/images/pos.png')} style={styles.pos} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.letter, { color: '#e74c3c' }]}>P</Text>
        <Text style={[styles.letter, { color: '#f1c40f' }]}>Y</Text>
        <Text style={[styles.letter, { color: '#8cc63f' }]}>S</Text>
        <Text style={[styles.letter, { color: '#8cc63f' }]}>S</Text>
        <Text style={[styles.letter, { color: '#e6ba9f' }]}>U</Text>
        <Text style={[styles.letter, { color: '#2c3e50' }]}>M</Text>
        <Text style={styles.posText}>POS</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor="#b3b3b3"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#b3b3b3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} 
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => Alert.alert("Coming Soon", "Forgot Password feature will be added soon!")}>
        <Text style={
            styles.forgotPasswordText}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >Forget Password ?</Text>
      </TouchableOpacity>
    </View>
  );
}

