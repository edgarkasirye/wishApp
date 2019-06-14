import React, {Component} from 'react';
import { Platform, StyleSheet, View, ImageBackground } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { Text, Input, Item, Button, Icon } from 'native-base'
import Edgar from '../edgar'

export default class HomeScreen extends Component {
  render() {
    return (
    <Edgar/>
    );
  }
}