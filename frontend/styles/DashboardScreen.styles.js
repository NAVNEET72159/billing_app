import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Soft gray background for high contrast against the white cards
  },
  scrollContent: {
    paddingBottom: 40, // Extra padding so cards don't hit the bottom nav
  },
  
  // --- WELCOME HERO BANNER ---
  welcomeSection: {
    backgroundColor: '#00D26A', // 🚀 The exact vibrant green from your login screen
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 60, // Extra bottom padding for the overlap effect
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: -35, // Negative margin pulls the cards UP to overlap the green banner
    shadowColor: '#00D26A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  dashboardSubtitle: {
    fontSize: 15,
    color: '#E6FFF2',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // --- GRID LAYOUT ---
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  gridContainerDesktop: {
    justifyContent: 'center',
    gap: 25, // Clean gap spacing for web browsers
  },

  // --- FLOATING CARDS ---
  card: {
    backgroundColor: '#FFFFFF',
    width: '47%', // Automatically creates 2 columns on mobile
    aspectRatio: 1, // Forces perfect squares
    borderRadius: 20,
    padding: 15,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4, 
  },
  cardDesktop: {
    width: 160,
    height: 160,
  },
  
  // 🚀 HIGHLIGHTED CARD (New Bill)
  highlightCard: {
    backgroundColor: '#1E1E1E', // Sleek dark theme
  },

  // --- ICONS ---
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#F3F4F6', // Subtle circle behind the image
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  highlightIconContainer: {
    backgroundColor: '#333333', // Darker circle for the highlighted card
  },
  cardIcon: {
    width: 32,
    height: 32,
  },

  // --- TEXT ---
  cardText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  highlightCardText: {
    color: '#00D26A', // Makes the text pop in the brand green!
  },

  // --- HIDDEN SIGNATURE ---
  signatureText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#D1D5DB', // Light gray so it blends into the background nicely
  }
});