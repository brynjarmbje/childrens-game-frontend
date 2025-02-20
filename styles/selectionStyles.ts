import { StyleSheet } from 'react-native';

const selectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Georgia',
  },
  item: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  itemSelected: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  itemText: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Georgia',
  },
  button: {
    backgroundColor: '#FF6F61',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF6F61',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default selectionStyles;
