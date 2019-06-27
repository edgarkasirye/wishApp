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
    	{/* <View
    	style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:10}}>
    		<Icon name="heart" size={80} style={{color:"#F02D3A",marginTop:15}}/>
    		<Text style={{textAlign:"center",color:"#F02D3A",fontSize:50,fontWeight:'bold'}}>
      Wish</Text>
    	</View> */}

      {/* <View style={{margin:10}}>
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
      </View> */}
      <Text style={{color:"#9F9A9A", marginLeft:10}}>Create an account</Text>
      <View style={{marginLeft:10,width:220}}>
        <Text style={{fontSize:30, color:"#fff", fontFamily:"times-new-roman"}}>Meet people for a relationship of your taste</Text>
      </View>
      <View style={{position:"absolute",bottom:10,right:10,left:10}}>
        <Button
        block
        onPress={()=>this.login()}
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
