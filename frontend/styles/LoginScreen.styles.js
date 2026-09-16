import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00D26A', // Vibrant Green
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // --- LEFT SECTION ---
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: Platform.OS !== 'web' ? 250 : 'auto',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posImage: {
    width: 140,
    height: 180,
    marginRight: 20,
  },
  
  // 🚀 Text Alignment Wrappers
  textWrapper: {
    alignItems: 'center', // Centers POS under PYSSUM
    justifyContent: 'center',
  },
  curvedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  posOffset: {
    marginTop: -10, // Pulls the "POS" text tighter under the "PYSSUM" arch
  },

  // 🚀 Font Styles (Removed Letter Spacing in favor of margin)
  pyssumText: {
    fontSize: 54,
    fontWeight: '900',
    color: '#FFFFFF',
    marginHorizontal: 1.5, // Acts as letter-spacing for the split characters
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  posTextLarge: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    marginHorizontal: 2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },

  // --- RIGHT SECTION ---
  formSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 450,
    borderRadius: 15,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF', // Soft modern blue
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1F2937',
    outlineStyle: 'none',
  },
  button: {
    backgroundColor: '#1E1E1E', // Dark button color
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  forgotPasswordText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    fontWeight: '500',
  }
});