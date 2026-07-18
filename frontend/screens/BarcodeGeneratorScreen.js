import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import Header from '../components/Header';
import { styles } from '../styles/BarcodeGeneratorScreen.styles';
import AddItemModal from '../components/AddItemModal'; 
import { captureRef, MediaLibrary } from '../components/utils/NativeModules';

export default function BarcodeGeneratorScreen({ navigation }) {
    const [barcode, setBarcode] = useState('');
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const barcodeViewRef = useRef();
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
        setAddModalVisible(true);
    };

    const saveBarcodeLocally = async () => {
        if (!barcode) {
            Alert.alert("Empty", "Please generate a barcode to save first.");
            return;
        }

        if (Platform.OS === 'web') {
            Alert.alert("Web Mode", "Saving directly to the photo gallery is only supported on mobile devices.");
            return;
        }
        if (!MediaLibrary || !captureRef) {
            Alert.alert("Rebuild Required", "Native modules are missing. Please rebuild the Android app.");
            return;
        }
        
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need permission to save images to your gallery.');
                return;
            }
            const localUri = await captureRef(barcodeViewRef, {
                format: 'png',
                quality: 1,
            });
            await MediaLibrary.saveToLibraryAsync(localUri);
            Alert.alert("Success!", `Barcode ${barcode} has been saved to your photo gallery.`);
            
        } catch (error) {
            console.error("Save Image Error:", error);
            Alert.alert("Error", "Failed to save the barcode image.");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}><Header /></View>
            <Text style={styles.pageTitle}>Barcode Generator</Text>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* The Visual Barcode Display Card */}
                <View style={styles.displayCard} ref={barcodeViewRef} collapsable={false} >
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
                    <TouchableOpacity style={styles.downloadBtn} onPress={saveBarcodeLocally}>
                        <Text style={styles.downloadBtnText}>⬇️ Save as PNG</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <AddItemModal 
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                initialBarcode={barcode}
                onAddSuccess={() => {
                    setBarcode('');
                    navigation.navigate('Inventory');
                }}
            />
        </View>
    );
}