import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions,StatusBar} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right, Badge, Left, Body } from 'native-base';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import Jazz from './jazz';
import firebase from 'react-native-firebase'
import { useScreens } from 'react-native-screens';

const {width, height} = Dimensions.get("window");

class MainChat extends Component{
  state={
    messages:["Heya", "Is this Belinda belinda? Like Linda huh?!!", "Are you for real?", "Haha..", "Look at that! She gon be hated, wait and you see..", "Does it have to end like this?","Haha..Gotcha..reverse psychology!!","Oh please!","Good night."],
    names:["Belinda","Faith","Ritah","Lindah","Ronah","Marion","Lindsey","Sheba","Martha"],
    images:[
      require("../images/1.jpg"),
      require("../images/2.jpg"),
      require("../images/3.jpg"),
      require("../images/4.jpg"),
      require("../images/5.jpg"),
      require("../images/6.jpg"),
      require("../images/7.jpg"),
      require("../images/8.jpg"),
      require("../images/9.jpg"),
    ],
    chats:[]
  }

  componentDidMount(){
    // retrieve all documents with current user id
    let chats = [];
    firebase.firestore().collection("chat_replica").get()
    .then(querySnapShot=>{
      querySnapShot.forEach(()=>{
        let {sender , lastMessage, senderName} = doc.data();
        if(sender || receiver === firebase.auth().currentUser.uid){
          chats.push({
            sender,
            lastMessage,
            senderName
          })
        }
      })
      
    })
    .catch(err=>alert(err))
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <Header 
        androidStatusBarColor="#CC167A" 
        style={{backgroundColor:"#CC167A"}}>
          <Left>
            <Text style={{fontSize:20,color:"#fff"}}>iChat</Text>
          </Left>
            <Body/>
          <Right>
            <Icon name="md-more" size={30} style={{color:"#fff"}}/>
          </Right>
        </Header>
        <View>
          {this.state.chats !== null ?
            <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.chats}
            keyExtractor={(index) => index}
            renderItem={({item, index})=>(
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate("Jazz")}
               style={{flexDirection:"row",padding:10}}>
                {/* <TouchableOpacity>
                  <Image source={this.state.images[index]} style={{width:50,height:50,borderRadius:25}}/>
                </TouchableOpacity> */}
                <View style={{marginLeft:10}}>
                  <Text style={{fontSize:20}}>{item.senderName}</Text>
                  <View>
                    {item.lastMessage.length > 20 ?
                      <Text note>{item.lastMessage.slice(0,40)+' ...'}</Text>:
                      (
                        <Text note>{item.lastMessage}</Text>
                      )
                    }
                  </View>
                </View>
                {/* Add view to show if there are new messages */}
                {/* <View style={{backgroundColor:"#000", borderRadius:10, width:20,height:20, position:"absolute",right:3,top:32}}>
                  <Text style={{textAlign:"center", color:"#fff"}}>3</Text>
                </View> */}
              </TouchableOpacity>
            )}
            /> :
            <View style={{flex:1}}>
              <Text style={{textAlign:"center",fontSize:20}}>No chats yet? Let other know you by winking at them</Text>
            </View>
          }
        </View>
        
        
      </View>
    )
  }
}

const ChatNavigator = createStackNavigator({
  MainChat:MainChat,
  Jazz:Jazz
},{
  defaultNavigationOptions:{
    header:null
  }
})

const ChatRoute = createAppContainer(ChatNavigator);
export default ChatRoute;