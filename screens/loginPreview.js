import React, {Component} from 'react';
import { Platform, StyleSheet, View, ImageBackground, StatusBar, Animated } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { Text, Input, Item, Button, Icon } from 'native-base'
import firebase from 'react-native-firebase'

export default class LoginPreview extends Component {
  
  render() {
    return (
    <ImageBackground
    source={require('../pics/backlit.jpg')}
    style={{width:"100%",height:"100%",flex:1}}>
      <StatusBar backgroundColor={'#000'}/>

      <Text style={{color:"#9F9A9A", marginLeft:10}}>Create an account</Text>
      <View style={{marginLeft:10,width:220}}>
        <Text style={{fontSize:30, color:"#fff", fontFamily:"times-new-roman"}}>Meet people for a relationship of your taste</Text>
      </View>


      <View style={{position:"absolute",bottom:10,right:10,left:10}}>
        <Button
        block
        onPress={()=>this.props.navigation.navigate("Login")}
        style={{backgroundColor:"#F02D3A",borderRadius:40,margin:10}}>
          <Text>Sign In</Text>
        </Button>

        <Button
        block
        onPress={()=>this.props.navigation.navigate("SignUp")}
        style={{backgroundColor:"#3b5998",borderRadius:40,margin:10}}>
          <Text>Sign Up</Text>
        </Button>
      </View>
    </ImageBackground>
    );
  }
}
