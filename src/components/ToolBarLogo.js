import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

class ToolbarLogo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../images/logo.png')}
          resizeMode='contain'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  logo: {
    width: 100, 
    height: 46,
  },
});

export default ToolbarLogo;