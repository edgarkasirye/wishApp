import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right } from 'native-base';

const {width, height} = Dimensions.get("window");

class Edgar extends Component {
  state = {
    images:[
      require("./images/1.jpg"),
      require("./images/2.jpg"),
      require("./images/3.jpg"),
      require("./images/4.jpg"),
      require("./images/5.jpg"),
      require("./images/6.jpg"),
      require("./images/7.jpg"),
      require("./images/8.jpg"),
      require("./images/9.jpg"),
    ],
    names:["Belinda","Faith","Ritah","Lindah","Ronah","Marion","Lindsey","Sheba","Martha"],
    cities:["Kampala","Rujuti","Kinshasha","Lagos","Nairobi","Mbale","Jinja","Kigali","Pretoria"]
  }
  render() {
    return (
      <ScrollView style={{flex:1}}>
      
        <Text style={{textAlign:"center",fontSize:40,marginVertical:10,fontWeight:"200"}}>iWish</Text>

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} 
        style={{marginLeft:10,flexDirection:"row"}}>
          {this.state.images.map((item,index)=>(
            <View style={{marginHorizontal:10}}>
              <TouchableOpacity 
              style={{borderColor:"#F02D3A",width:66,height:66,borderRadius:33,borderWidth:1.5}}>
                <Image source={item} style={{width:60,height:60,borderRadius:30,margin:2}}/>
              </TouchableOpacity>
              <Text style={{textAlign:"center"}}>{this.state.names[index]}</Text>
            </View>
          ))}
        </ScrollView>
        
        <Text style={{fontSize:20,marginHorizontal:15,marginTop:10}}>Discover</Text>

        <View style={{marginHorizontal:10}}>
        {this.state.images.map((item,index)=>(
          <View style={{marginVertical:10}}>
            <Image source={item} style={{width:width-20,height:300,borderRadius:15}}/>
            <View style={{flexDirection:"row",marginVertical:10}}>
              <Image source={item} style={{width:60,height:60,borderRadius:30}}/>
              <View style={{marginLeft:10,marginTop:5}}>
                <Text style={{fontSize:18}}>{this.state.names[index]}</Text>
                <Text style={{color:"#9F9A9A"}}>{this.state.cities[index]}</Text>
              </View>
              <View style={{position:"absolute",right:10,flexDirection:"row",marginTop:10}}>
                <TouchableOpacity
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1}}>
                  <Icon name="heart" size={30} style={{textAlign:"center"}}/>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1,marginLeft:10}}>
                  <Image source={require('./svgs/wink.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        </View>

      </ScrollView>
    );
  }
}

export default Edgar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});
