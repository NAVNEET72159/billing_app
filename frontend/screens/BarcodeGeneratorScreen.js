import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Header from '../components/Header';
import { styles } from '../styles/BarcodeGeneratorScreen.styles';

export default function BarcodeGeneratorScreen({ navigation }) {
    const [barcode, setBarcode] = useState('');
    const generateRandomBarcode = () => {
        const newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setBarcode(newCode);
    };
    const renderVisualBarcode = () => {
        if (!barcode) 
            return null;
        
        const bars = barcode.split('').map(num => parseInt(num) === 0 ? 1 : parseInt(num));
        
        return (
            <View style={styles.barcodeVisualizer}>
                {bars.map((width, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.barcodeLine, 
                            { width: width > 5 ? 4 : width, marginHorizontal: width > 7 ? 2 : 1 }
                        ]} 
                    />
                ))}
                {bars.reverse().map((width, index) => (
                    <View 
                        key={`mirror-${index}`} 
                        style={[
                            styles.barcodeLine, 
                            { width: width > 5 ? 3 : width, marginHorizontal: width > 7 ? 2 : 1 }
                        ]} 
                    />
                ))}
            </View>
        );
    };

    const handleSave = () => {
        if (!barcode) {
            Alert.alert("Empty", "Please generate or enter a barcode first.");
            return;
        }
        Alert.alert("Coming Soon", `Barcode ${barcode} is ready! We can link this to the Add Inventory screen next.`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}><Header /></View>
            <Text style={styles.pageTitle}>Barcode Generator</Text>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* The Visual Barcode Display Card */}
                <View style={styles.displayCard}>
                    {barcode ? (
                        <View style={styles.barcodeContainer}>
                            {renderVisualBarcode()}
                            <Text style={styles.barcodeText} letterSpacing={8}>{barcode}</Text>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>No Barcode Generated</Text>
                            <Text style={styles.placeholderSubtext}>Click below to create a new 12-digit code</Text>
                        </View>
                    )}
                </View>

                <View style={styles.controlsContainer}>
                    <Text style={styles.label}>Custom Barcode (Optional)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        maxLength={15}
                        placeholder="Type a custom code..."
                        value={barcode}
                        onChangeText={setBarcode}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.btn, styles.generateBtn]} onPress={generateRandomBarcode}>
                            <Text style={styles.generateBtnText}>Generate Random</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={() => setBarcode('')}>
                            <Text style={styles.clearBtnText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Assign to Inventory Item</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}