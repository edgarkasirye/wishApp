import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native'
import { Icon } from 'native-base'

const {width, height} = Dimensions.get("window");

export default class ProfileScreen extends Component{
  state={
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
      <ScrollView style={{flex:1,backgroundColor:"#000"}}>
        <StatusBar backgroundColor={'#000'}/>
        <TouchableOpacity
        style={{position:"absolute",top:10,marginLeft:20,zIndex:2}}>
          <Icon name="arrow-round-back" size={30} style={{color:"#fff"}}/>
        </TouchableOpacity>
        <View>
          <Image 
          source={require("../pics/girl2.jpeg")}
          style={{width:"100%",height:height-300}}/>
        </View>
        <View style={{ borderTopLeftRadius:40,borderTopRightRadius:40,flex:1,backgroundColor:"#fff"}}>
          <View style={{flexDirection:"row",marginVertical:10}}>
            <Image 
            source={require("../images/2.jpg")} 
            style={{width:60,height:60,borderRadius:30,marginLeft:10}}/>
            <View style={{marginLeft:10,marginTop:5}}>
              <Text style={{fontSize:20,color:"#000", fontWeight:"700"}}>Jael Apolot</Text>
              <Text style={{fontSize:16,color:"#000", fontWeight:"200"}}>Packwach</Text>
            </View>
            <View style={{position:"absolute",right:10,flexDirection:"row",marginTop:10}}>
              <TouchableOpacity
              style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1}}>
                <Icon name="heart" size={30} style={{textAlign:"center"}}/>
              </TouchableOpacity>
              <TouchableOpacity 
              style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1,marginLeft:10}}>
                <Image source={require('../svgs/wink.png')} style={{width:30,height:30}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginHorizontal:20}}>
            <Text style={{fontSize:18,color:"#000", fontWeight:"100"}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
          </View>
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} 
          style={{flexDirection:"row"}}>
            <View style={{backgroundColor:"#000", padding:10, borderRadius:20,margin:10}}>
              <Text style={{color:"#fff"}}>Bike Riding</Text>
            </View>
            <View style={{backgroundColor:"#000", padding:10, borderRadius:20,margin:10}}>
              <Text style={{color:"#fff"}}>Swimming</Text>
            </View>
            <View style={{backgroundColor:"#000", padding:10, borderRadius:20,margin:10}}>
              <Text style={{color:"#fff"}}>Astronomy</Text>
            </View>
            <View style={{backgroundColor:"#000", padding:10, borderRadius:20,margin:10}}>
              <Text style={{color:"#fff"}}>Reading novels</Text>
            </View>
          </ScrollView>
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} 
          style={{marginLeft:10,flexDirection:"row"}}>
            {this.state.images.map((item,index)=>(
              <View style={{marginHorizontal:10}}>
                <TouchableOpacity 
                style={{width:100,height:100,borderRadius:10}}>
                  <Image source={item} style={{width:100,height:100,borderRadius:10,margin:2}}/>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    )
  }
}