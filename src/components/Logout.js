import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight, Alert, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../constants/strings';

class Logout extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.handleLogout} underlayColor="black">
        <View style={styles.button}>
          <MaterialCommunityIcons name="logout" size={25} color="#fff"/>
        </View>
      </TouchableHighlight> 
    );
  }

  handleLogout = () => {
    Alert.alert(
      strings.logout,
      strings.areYouSure,
      [
        {text: strings.cancel, onPress: null, style: 'cancel'},
        {text: strings.yes, onPress: this.props.onLogout },
      ],
    );
  };
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgb(150, 179, 71)',
  },
});

Logout.propTypes = {
  onLogout: PropTypes.func
};

export default Logout;