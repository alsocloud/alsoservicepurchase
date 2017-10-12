import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, Button, TouchableHighlight, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

class Dialog extends Component {  
  render() {
    const { visible, headerText } = this.props;

    let { width } = this.props;
    if (!width)
      width = '100%';

    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={visible}
        onRequestClose={this.handleNegativeButtonPressed}
      >
        <View style={styles.container}>
          <View style={[styles.content, {width}]}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{headerText ? headerText : 'Header Text???'}</Text>
            </View>

            {this.renderBody()}

            {this.renderButtons()}
          </View>
        </View>
      </Modal> 
    );
  }

  renderBody = () => {
    const { body } = this.props;

    if (typeof(body) === 'string' || !body)
      return (
        <View style={styles.body}>
          <Text>{body ? body : 'Body???'}</Text>
        </View>
      );
    else
      return body;
  };

  renderButtons = () => {
    return (
      <View style={styles.buttonsContainer}>
        {this.renderNegativeButton()}

        {this.renderPositiveButton()}
      </View>
    );
  };

  renderNegativeButton = () => {
    const {negativeButtonText, onNegativeButtonPressed} = this.props;

    if (negativeButtonText || onNegativeButtonPressed) 
      return (
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this.handleNegativeButtonPressed} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>{negativeButtonText ? negativeButtonText : 'No'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
  };

  renderPositiveButton = () => {
    const {positiveButtonText, onPositiveButtonPressed} = this.props;

    if (positiveButtonText || onPositiveButtonPressed) 
      return (
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this.handlePositiveButtonPressed} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>{positiveButtonText ? positiveButtonText : 'Yes'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
  };
  
  handleNegativeButtonPressed = () => {
    const { onNegativeButtonPressed } = this.props;

    if (onNegativeButtonPressed)
      onNegativeButtonPressed();
  };
  
  handlePositiveButtonPressed = () => {
    const { onPositiveButtonPressed } = this.props;

    if (onPositiveButtonPressed)
      onPositiveButtonPressed();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    backgroundColor: '#dedede',
    borderRadius: 5,
  },

  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },

  headerText: {
    fontSize: 21,
    color: '#323232',
  },

  body: {
    backgroundColor: 'white',
    padding: 10,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    padding: 20,
  },

  bodyText: {
    fontSize: 16.5,
    color: '#323232',
  },

  buttonContainer: {
    backgroundColor: 'transparent',
    width: 120,
    marginLeft: 10,
    marginRight: 10,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.alsoGreen,
    padding: 15,
  },

  buttonText: {
    fontSize: 16.5,
    color: 'white',
  },
});

Dialog.propTypes = {
  visible: PropTypes.bool,
  width: PropTypes.number,
  headerText: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  negativeButtonText: PropTypes.string,
  positiveButtonText: PropTypes.string,
  onNegativeButtonPressed: PropTypes.func,
  onPositiveButtonPressed: PropTypes.func,
};

export default Dialog;