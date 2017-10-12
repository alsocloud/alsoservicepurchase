import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import NavigateBack from './NavigateBack';

class SecondaryToolbar extends Component {
  render() {
    const { title, secondaryButton } = this.props;
    const primaryButton = this.getPrimaryButton();

    return (
      <View style={styles.container}>
        <View style={styles.primaryButtonContainer}>
          {primaryButton}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>

        <View style={styles.secondaryButtonContainer}>
          {secondaryButton}
        </View>
      </View>
    );
  }

  getPrimaryButton = () => {
    let { primaryButton } = this.props;

    if (!primaryButton) {
      const { from, navigation } = this.props;

      if (from && navigation) {
        primaryButton = <NavigateBack navigation={navigation}/>;
      }
    }

    return primaryButton;
  }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      backgroundColor: '#545454',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 10,
      paddingBottom: 10,
    },
    
    primaryButtonContainer: {
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
    },
  
    textContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      marginLeft: 14,
    },
  
    text: {
      color: '#fff',
      fontSize: 16.5,
    },
  
    secondaryButtonContainer: {
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
    },
});

SecondaryToolbar.propTypes = {
  primaryButton: PropTypes.element,
  title: PropTypes.string,
  secondaryButton: PropTypes.element,
  from: PropTypes.string,
  navigation: PropTypes.object,
};

export default SecondaryToolbar;