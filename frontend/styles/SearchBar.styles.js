import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3, 
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#a0a0a0',
    marginRight: 10,
  }
});