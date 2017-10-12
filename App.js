import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import AvailableServicesScreen from './src/screens/AvailableServicesScreen';
import ConfigurationScreen from './src/screens/ConfigurationScreen';

const AlsoServicePurchase = StackNavigator({
  Splash: { screen: SplashScreen },
  Login: { screen: LoginScreen },
  AvailableServices: { screen: AvailableServicesScreen },
  Configuration: { screen: ConfigurationScreen },
});

AppRegistry.registerComponent('AlsoServicePurchase', () => AlsoServicePurchase);