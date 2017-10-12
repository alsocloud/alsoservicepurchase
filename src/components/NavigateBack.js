import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class NavigateBack extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.handleBackClicked} underlayColor="black">
        <View style={styles.button}>
          <MaterialIcons name="arrow-back" size={25} color="#fff"/>
        </View>
      </TouchableHighlight> 
    );
  }

  handleBackClicked = () => {
    const { goBack } = this.props.navigation;

    goBack();
  };
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

NavigateBack.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default NavigateBack;