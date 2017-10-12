import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToolbarLogo from './ToolbarLogo';

class Toolbar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ToolbarLogo/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 56,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.3,
    elevation: 4,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default Toolbar;