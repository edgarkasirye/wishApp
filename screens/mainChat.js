import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right, Badge } from 'native-base';

const {width, height} = Dimensions.get("window");

export default class MainChat extends Component{
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
  }
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flexDirection:"row"}}>
          <Icon/>
          <Icon/>
        </View>
        {/* <FlatList
        data={this.state.messages}
        keyExtractor={(index) => index}
        renderItem={({item, index})=>(
          <View style={{borderBottomColor:"#000", borderBottomWidth:0.5, flexDirection:"row",padding:10}}>
            <TouchableOpacity>
              <Image source={this.state.images[index]} style={{width:50,height:50,borderRadius:25}}/>
            </TouchableOpacity>
            <View style={{marginLeft:10}}>
              <Text>{this.state.names[index]}</Text>
              <Text>{item}</Text>
              <View style={{backgroundColor:"#000", borderRadius:10, width:20,height:20, position:"absolute",right:0}}>
                <Text style={{textAlign:"center", color:"#fff"}}>3</Text>
              </View>
            </View>
          </View>
        )}
        /> */}
      </View>
    )
  }
}