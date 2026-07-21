let captureRefFn = null;
let mediaLibraryModule = null;

try {
    captureRefFn = require('react-native-view-shot').captureRef;
} catch (error) {
    console.warn('react-native-view-shot is unavailable in this environment.', error);
}

try {
    mediaLibraryModule = require('expo-media-library');
} catch (error) {
    console.warn('expo-media-library is unavailable in this environment.', error);
}

export const captureRef = captureRefFn;
export const MediaLibrary = mediaLibraryModule;