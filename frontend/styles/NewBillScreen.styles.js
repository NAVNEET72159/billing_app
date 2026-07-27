import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 15,
    textTransform: 'uppercase',
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c4d',
  },
  checkoutButton: {
    backgroundColor: '#2c2c4d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c2c4d',
    textAlign: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#a0a0a0',
    marginRight: 10,
  },
  customerRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // --- TOP TITLE & CART ICON ---
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    cartIconBtn: {
        position: 'relative',
        padding: 5,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -5,
        backgroundColor: '#DE3931',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // --- SIDE PANEL CART MODAL (Matches 4.png) ---
    cartOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // Dimmed background
        justifyContent: 'center',
        alignItems: 'flex-end', // Pushes the panel to the right
    },
    sideCartPanel: {
        width: '75%', // Takes up 75% of the screen width
        height: '80%', // Floating effect
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    sideCartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 20,
        color: '#000',
    },
    sideCartItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 15,
    },
    sideCartItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sideCartItemName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    sideCartItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    sideCartItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sideCartQtyLabel: {
        fontSize: 14,
        color: '#666',
    },
    
    // --- MANUAL TEXT BOX CONTROLS ---
    qtyControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallQtyBtn: {
        backgroundColor: '#f0f0f0',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    smallQtyText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    smallQtyInput: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyCartText: {
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
        fontStyle: 'italic',
    },

    // --- PROCEED FOOTER ---
    sideCartFooter: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 15,
    },
    sideCartTotalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
    },
    proceedBtn: {
        backgroundColor: '#7DBA45', // Green color
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    proceedBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sideCartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sideCartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    closeCartIcon: {
        fontSize: 22,
        color: '#DE3931',
        paddingHorizontal: 10,
    },
});
