import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

class FinishButton extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.handleFinish} underlayColor="black">
        <View style={styles.button}>
          <Text style={styles.text}>Save</Text>
        </View>
      </TouchableHighlight> 
    );
  }

  handleFinish = () => {
    const { onFinish } = this.props;

    onFinish();
  };
}

const styles = StyleSheet.create({
  button: {
    // width: 40,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 16.5,
    color: 'white',
  }
});

FinishButton.propTypes = {
  onFinish: PropTypes.func,
};

export default FinishButton;