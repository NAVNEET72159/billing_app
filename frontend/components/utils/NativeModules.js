import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

captureRef = null;
MediaLibrary = null;

try {
    captureRef = require('react-native-view-shot').captureRef;
    MediaLibrary = require('expo-media-library');
} catch (error) {
    console.warn("Native modules are compiling...");
}

export { captureRef, MediaLibrary };