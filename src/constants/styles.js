import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  error: {
    color: 'red',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topCenterContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  leftCenterContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  centerCenterContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  button: {
    backgroundColor: colors.alsoGreen,
  },

  text: {
    fontFamily: 'OpenSans',
  },
});
