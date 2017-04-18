/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Main from './app/main/GDMain';
export default class RNGD extends Component {
  render() {
    return (
      <Main/>
    );
  }
}
AppRegistry.registerComponent('RNGD', () => RNGD);
