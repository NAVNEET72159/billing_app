import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff', // Clean white background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  welcome: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginBottom: 10,
  },
  logo: {
    width: 170,
    height: 145,
    resizeMode: 'contain',
  },
  pos: {
    width: 140,
    height: 100,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
    // Colorful Letter Base Style
  letter: {
    fontSize: 34,
    fontWeight: '900',
  },
  posText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000000',
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2c2c4d', // The dark navy/purple from your image
    width: '100%',
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default styles;