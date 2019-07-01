import React, {Component} from 'react';
import { Platform, StyleSheet, View, ImageBackground, StatusBar, Animated } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { Text, Input, Item, Button, Icon } from 'native-base'
import firebase from 'react-native-firebase'

export default class LoginScreen extends Component {
  state = {
    email:'',
    password:'',
    loading:false,
    message:''
  }

  login(){
    const {email, password} = this.state
    this.setState({loading:true, message:''})

    if(email !== '' && password !== ''){
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        this.props.navigation.navigate('Home', {user})
      })
      .catch(err=>{
        this.setState({loading:false, message:err.message})
      })
    }else{
      this.setState({loading:false, message:"Let's first get those fields complete."})
    }
  }
  render() {
    const {message} = this.state
    return (
    <ImageBackground
    source={require('../pics/backlit.jpg')}
    style={{width:"100%",height:"100%",flex:1}}>
      <StatusBar backgroundColor={'#000'}/>
      <Text>{message}</Text>

      <View style={{justifyContent:"center",flex:1,margin:10}}>
        <View style={{margin:10}}>
          <Item rounded>
            <Input placeholder="Email"
            placeholderTextColor={"#fff"}
            onChangeText={(email)=>this.setState({email})}/>
          </Item>
        </View>
        <View style={{margin:10}}>
          <Item rounded>
            <Input placeholder="Password"
            secureTextEntry
            placeholderTextColor={"#fff"}
            onChangeText={(password)=>this.setState({password})}/>
          </Item>
        </View>
        <Button
        block
        onPress={()=>this.login()}
        style={{backgroundColor:"#F02D3A",borderRadius:40,marginHorizontal:10}}>
          <Text>Sign In</Text>
        </Button>
      </View>
    
    </ImageBackground>
    );
  }
}
