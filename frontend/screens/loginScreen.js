import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreen.styles';
import { loginUser } from '../services/authServices';

export default function LogInScreen({ navigation, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🚀 Set up the Bounce Animation Value
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🚀 Create a continuous bouncing loop
    const bounce = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -25, // Jump up
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0, // Fall back down with a spring effect
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start(() => setTimeout(bounce, 1500)); // Wait 1.5 seconds, then bounce again
    };
    bounce();
  }, [bounceAnim]);

  const renderCurvedText = (text, textStyle, angleStep, yStep) => {
    return (
      <View style={styles.curvedRow}>
        {text.split('').map((char, i) => {
          const mid = text.length / 2;
          const distance = (i + 0.5) - mid; // Distance from the center character
          const rotate = `${distance * angleStep}deg`; // Rotate outer letters more
          const translateY = (distance * distance) * yStep; // Parabolic drop for outer letters

          return (
            <Text key={i} style={[textStyle, { transform: [{ rotate }, { translateY }] }]}>
              {char}
            </Text>
          );
        })}
      </View>
    );
  };

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar hidden={true} />
      
      {/* 🚀 LEFT SIDE: Branding & Bouncing Text */}
      <View style={styles.leftSection}>
        <View style={styles.brandingContainer}>
            <Image 
                source={require('../assets/images/pos.png')} 
                style={styles.posImage} 
                resizeMode="contain"
            />
            
            {/* Apply the bounce animation specifically to the text block */}
            <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                {renderCurvedText("PYSSUM", styles.pyssumText, 5, 1.2)}
                <View style={styles.posOffset}>
                    {renderCurvedText("POS", styles.posTextLarge, 6, 2)}
                </View>
            </Animated.View>
        </View>
      </View>

      {/* 🚀 RIGHT SIDE: The Form */}
      <View style={styles.formSection}>
        <View style={styles.formCard}>
          <Text style={styles.headerTitle}>Login Now</Text>
          <Text style={styles.headerSubtitle}>Enter your details to access the PYSSUM POS system.</Text>

          <View style={styles.inputWrapper}>
             <Text style={styles.inputIcon}>👤</Text>
             <TextInput 
                style={styles.input}
                placeholder="superadmin"
                placeholderTextColor="#6B7280"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
             />
          </View>

          <View style={styles.inputWrapper}>
             <Text style={styles.inputIcon}>🔒</Text>
             <TextInput 
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true} 
             />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>NEXT</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "Forgot Password feature will be added soon!")}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}