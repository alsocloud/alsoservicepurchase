import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { styles } from '../constants/styles';
import Store from '../apis/Store';
import Session from '../apis/Session';
import GetUser from '../apis/GetUser';
import { strings } from '../constants/strings';

export default class SplashScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      checkingForAuth: true,
      delay: 1000,
    };
  }

  componentWillMount() {
    const store = new Store();

    const getPromise = store.getItem(strings.token);

    getPromise.then(this.doIfGetPromiseSuccess).catch(this.doIfGetPromiseFailure);
  }

  doIfGetPromiseSuccess = (token) => {
    const { delay } = this.state;
    
    const session = new Session();

    const promise = session.isValid();

    setTimeout(() => {
      promise.then(this.doIfSessionIsValidPromiseSuccess).catch(this.doIfSessionIsValidPromiseFailure);
    }, delay);
  };

  doIfSessionIsValidPromiseSuccess = () => {
    const getUser = new GetUser();

    const userPromise = getUser.begin();

    userPromise.then(() => {
      this.navigateTo('AvailableServices');
    }).catch((error) => {
      this.doIfGetUserPromiseFailure(error);
    });

    // this.navigateTo('AvailableServices');
  };

  doIfGetUserPromiseFailure = (error) => {
    this.navigateTo('Login');
  };

  doIfSessionIsValidPromiseFailure = () => {
    this.navigateTo('Login');
  };

  doIfGetPromiseFailure = (error) => {
    const { delay } = this.state;

    setTimeout(() => {
      this.navigateTo('Login');
    }, delay);
  };

  navigateTo = (screen) => {
    /* Clears navigation stack and makes screen first item in stack. */

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen})
      ]
    });

    this.props.navigation.dispatch(resetAction)
  };
  
  render() {
    return (
      <View style={styles.centerCenterContainer}>
        <Text style={styles.title}>Also Cloud</Text>
        <Text style={{marginBottom: 20}}>www.also.com</Text>
        <ActivityIndicator/>
      </View>
    );
  }
}