import React, {Component} from 'react';
import { Platform, StyleSheet, View, ImageBackground, StatusBar, Animated, KeyboardAvoidingView,ToastAndroid } from 'react-native';
import { Text, Input, Item, Button, Icon, Spinner, Toast } from 'native-base'
import firebase from 'react-native-firebase'

export default class LoginScreen extends Component {
  state = {
    email:'',
    password:'',
    loading:false,
    message:''
  }

  login(){
    const {email, password,message} = this.state
    this.setState({loading:true, message:''})

    if(email && password){
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        this.props.navigation.navigate('Home', {user})
      })
      .catch(err=>{
        this.setState({loading:false, message:err.message})
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      })
    }else{
      this.setState({loading:false, message:"Let's first get those fields complete."})
      Toast.show({
        text: message,
        buttonText: "Okay",
        position: "bottom",
        type:"warning"
      })
    }
  }
  render() {
    const {message, loading} = this.state
    return (
    <ImageBackground
    source={require('../pics/backlit.jpg')}
    style={{width:"100%",height:"100%",flex:1}}>
      <StatusBar backgroundColor={'#000'}/>
      {loading ? <Spinner color='blue' /> :null}
      
      <View style={{flexDirection:"row",padding:20,alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:30}}>Log inTo </Text>
        <Text style={{color:"#CC167A",fontSize:30}}>iWish</Text>
      </View>

      <View style={{alignItems:"center",justifyContent:"center",marginHorizontal:20}}>
        <Text style={{fontSize:21,textAlign:"center",color:"#fff"}}>Hurry up to get started and let's get you to an exciting part of you</Text>
      </View>

      <View style={{justifyContent:"center",flex:1,margin:10}}>
        <View style={{margin:10}}>
        <KeyboardAvoidingView>
          <Item rounded style={{backgroundColor:"#fff",opacity:0.14}}>
            <Input 
            style={{color:"#fff",fontSize:20}}
            placeholder="Email"
            placeholderTextColor={"#000"}
            onChangeText={(email)=>this.setState({email})}/>
          </Item>
        </KeyboardAvoidingView>
        </View>
        <View style={{margin:10}}>
          <KeyboardAvoidingView>
            <Item rounded style={{backgroundColor:"#fff",opacity:0.14}}>
              <Input 
              style={{color:"#fff",fontSize:20}}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={"#141414"}
              onChangeText={(password)=>this.setState({password})}/>
            </Item>
          </KeyboardAvoidingView>
        </View>
        <Button
        block
        onPress={()=>this.login()}
        style={{borderRadius:20,marginHorizontal:10,backgroundColor:"#87004A"}}>
          <Text style={{color:"#fff"}}>Sign In</Text>
        </Button>
      </View>
    
    </ImageBackground>
    );
  }
}
