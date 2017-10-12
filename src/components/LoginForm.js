import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { colors } from '../constants/colors';
import { strings } from '../constants/strings';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }
  
  render() {
    return (
      <View>
        <View style={styles.inputs}>
          <TextInput
            style={[styles.input, styles.item]}
            onChangeText={(email) => this.setState({email})}
            placeholder={strings.emailAddress}
            keyboardType='email-address'
            value={this.state.email}
          />

          <TextInput
            style={[styles.input, styles.item]}
            onChangeText={(password) => this.setState({password})}
            placeholder={strings.password}
            secureTextEntry={true}
            value={this.state.password}
          />
        </View>

        <View>
          <Button
            onPress={this.handleLogin}
            title={strings.signIn}
            color={colors.alsoGreen}
          />
        </View>
      </View>
    );
  }

  handleLogin = () => {
    this.props.handleLogin({...this.state});
  };
}

const styles = StyleSheet.create({
  inputs: {
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

LoginForm.propTypes = {
  handleLogin: PropTypes.func
};

export default LoginForm;