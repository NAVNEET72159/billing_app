import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Animated, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreen.styles';
import { loginUser } from '../services/authServices';

export default function LogInScreen({ navigation, setToken }) {
  // 🚀 NEW: Detect screen size for responsiveness
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const bounce = () => {
      if (!isMounted.current) return;
      
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -25, 
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0, 
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start(({ finished }) => {
          if (finished && isMounted.current) {
              setTimeout(bounce, 1500); 
          }
      }); 
    };
    
    bounce();

    return () => {
        isMounted.current = false;
    };
  }, [bounceAnim]);

  const renderCurvedText = (text, textStyle, angleStep, yStep) => {
    return (
      <View style={styles.curvedRow}>
        {text.split('').map((char, i) => {
          const mid = text.length / 2;
          const distance = (i + 0.5) - mid; 
          const rotate = `${distance * angleStep}deg`; 
          const translateY = (distance * distance) * yStep; 

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
        await AsyncStorage.setItem('userRole', response.role);
        if (setToken) {
           setToken(response.token);
        }
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Network error. Is the server running?';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // 🚀 FIXED: Dynamically switches to column on phones, row on PC
      style={[styles.container, { flexDirection: isDesktop ? 'row' : 'column', flex: 1, backgroundColor: '#F57C00' }]}
    >
      <StatusBar hidden={true} />
      
      {/* 🚀 LEFT SIDE: Branding */}
      <View style={[
          styles.leftSection, 
          { 
              flex: isDesktop ? 1 : 0.4, // Takes up 40% of height on mobile
              width: isDesktop ? '50%' : '100%', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'transparent'
          }
      ]}>
        <View style={styles.brandingContainer}>
            <Image 
                source={require('../assets/images/pos.png')} 
                // 🚀 Scales image slightly down on mobile so it fits better
                style={[styles.posImage, { width: isDesktop ? 150 : 100, height: isDesktop ? 150 : 100 }]} 
                resizeMode="contain"
            />
            
            <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                {renderCurvedText("PYSSUM", styles.pyssumText, 5, 1.2)}
                <View style={styles.posOffset}>
                    {renderCurvedText("POS", styles.posTextLarge, 6, 2)}
                </View>
            </Animated.View>
        </View>
      </View>

      {/* 🚀 RIGHT SIDE: The Form */}
      <View style={[
          styles.formSection, 
          { 
              flex: isDesktop ? 1 : 0.6, // Takes up bottom 60% on mobile
              width: isDesktop ? '50%' : '100%', 
              justifyContent: isDesktop ? 'center' : 'flex-start', // Pushes up slightly on mobile
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: isDesktop ? 0 : 20,
              backgroundColor: 'transparent'
          }
      ]}>
        {/* 🚀 Forced max-width and center alignment so it never overflows off-screen */}
        <View style={[styles.formCard, { width: '100%', maxWidth: 400, alignSelf: 'center' }]}>
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