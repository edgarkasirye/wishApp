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

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      this.props.navigation.navigate('Home', {user})
    })
    .catch(err=>{
      this.setState({loading:false, message:err.message})
    })
  }
  render() {
    const {message} = this.state
    return (
    <ImageBackground 
    source={require('../pics/cover_9.jpeg')} 
    style={{width:"100%",height:"100%",flex:1}}>
      <StatusBar backgroundColor={'#000'}/>
      <Text>{message}</Text>
    	<View 
    	style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:10}}>
    		<Icon name="heart" size={80} style={{color:"#F02D3A",marginTop:15}}/>
    		<Text style={{textAlign:"center",color:"#F02D3A",fontSize:50,fontWeight:'bold'}}>
      Wish</Text>
    	</View>
    	
      <View style={{margin:10}}>
      	<Item rounded>
      		<Input placeholder="Email"
          placeholderTextColor={"#9C9990"}
          onChangeText={(email)=>this.setState({email})}/>
      	</Item>
      </View>
      <View style={{margin:10}}>
      	<Item rounded>
          <Input placeholder="Password"
          secureTextEntry
          placeholderTextColor={"#9C9990"}
          onChangeText={(password)=>this.setState({password})}/>
      	</Item>
      </View>
      <Button
      block 
      onPress={()=>this.login()}
      style={{backgroundColor:"#F02D3A",borderRadius:10,marginHorizontal:10}}>
      	<Text>Sign In</Text>
      </Button>

      <Text style={{textAlign:"center",color:"#ffffff",fontSize:30,marginVertical:20}}>OR</Text>

      <Button
      block 
      style={{backgroundColor:"#3b5998",borderRadius:10,marginHorizontal:10}}>
      	<Icon name="logo-facebook"/>
      	<Text>Facebook</Text>
      </Button>

      <Button transparent 
      style={{marginHorizontal:20}}
      onPress={()=>this.props.navigation.navigate("SignUp")}>
      <Text style={{textAlign:"center",color:"#ffffff"}}>
      Have no account yet? Get started here</Text>
      </Button>
    </ImageBackground>
    );
  }
}