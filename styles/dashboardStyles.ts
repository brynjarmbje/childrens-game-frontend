import { StyleSheet } from 'react-native';

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: 'Georgia',
  },
  listContainer: {
    marginTop: 20,
    flex: 1,
  },
  item: {
    fontSize: 18,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    color: '#1F1F1F',
    fontFamily: 'Georgia',
  },
  button: {
    backgroundColor: '#FF6F61',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default dashboardStyles;
