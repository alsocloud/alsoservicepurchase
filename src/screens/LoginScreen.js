import React, { Component } from 'react';
import { ScrollView , StyleSheet, View, Image, Text, TextInput, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { styles as globalStyle } from '../constants/styles';
import Auth from '../apis/Auth';
import GetUser from '../apis/GetUser';
import LoginForm from '../components/LoginForm';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { isEmptyString, isValidEmail } from '../helpers';
import { strings } from '../constants/strings';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      showLoading: false,
    };
  }
  
  render() {
    const { error, showLoading } = this.state;

    return (
      <View style={[globalStyle.container, styles.container]}>
        <ScrollView>
          <View style={styles.login}>
            <Image
              style={styles.logo}
              source={require('../images/logo.png')}
              resizeMode='contain'
            />

            <View style={styles.loginForm}>
              {error ? <Text style={[globalStyle.error, styles.error]}>{strings.loginError}</Text> : null}

              <LoginForm
                handleLogin={this.handleLogin}
              />
            </View>
          </View>

          <Image
            style={styles.clouds}
            source={require('../images/clouds.png')}
          />
        </ScrollView>

        <Spinner visible={showLoading} />
      </View>
    );
  }

  handleLogin = (fields) => {
    if (this.isValidFields(fields)) {
      this.doAuth(fields);
    } else {
      this.setState({ error: true });
    }
  };

  isValidFields = (fields) => {
    return this.validatedEmail(fields.email) && !isEmptyString(fields.password);
  };

  validatedEmail = (email) => {
    return !isEmptyString(email) && isValidEmail(email);
  };

  doAuth = (fields) => {
    this.setState({ error: false });

    this.setState({showLoading: true});

    this.beginAuthProcess(fields);
  };

  beginAuthProcess = (fields) => {
    const auth = new Auth(fields);

    const authPromise = auth.requestAuth();

    authPromise
      .then(this.onAuthSuccess)
      .catch(this.onAuthFailed);
  };

  onAuthSuccess = (data) => {
    const getUser = new GetUser();

    const userPromise = getUser.begin();

    userPromise.then(() => {
      this.doIfGetUserPromiseSuccess();
    }).catch((error) => {
      this.onAuthFailed(error);
    });

    // this.doIfGetUserPromiseSuccess();
  };

  doIfGetUserPromiseSuccess = () => {
    this.setState({showLoading: false});

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'AvailableServices'})
      ]
    });

    this.props.navigation.dispatch(resetAction);
  };

  onAuthFailed = (error) => {
    this.setState({showLoading: false});

    Toast.show(error.message, Toast.LONG);
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },

  login: {
    alignItems: 'center',
  },

  logo: {
    width: '75%',
    height: 150,
    marginTop: 50,
    marginBottom: 50,
  },
  
  error: {
    marginBottom: 10,
  },

  loginForm: {
    width: '80%',
  },

  clouds: {
    width: '100%',
    height: 250,
    marginTop: 50,
  },
});