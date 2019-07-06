import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import SignUpScreen from './screens/signUpScreen'
import LoginScreen from './screens/loginScreen'
import HomeScreen from './screens/homeScreen'
import LoginPreview from './screens/loginPreview'

export default class App extends Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}

const AppContainer = createStackNavigator({
  Home:HomeScreen,
  Preview:LoginPreview,
  Login : LoginScreen,
  SignUp : SignUpScreen,

},{
  defaultNavigationOptions:{
    header:null
  }
})

const AppNavigator = createAppContainer(AppContainer);
