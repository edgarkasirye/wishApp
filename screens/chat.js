import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { Icon, Item, Input } from 'native-base'

const {width, height} = Dimensions.get("window");

export default class Chat extends Component{
  state={
    messageCombo:["Good", "Earnest"],
    message:"",
  }

  updateMessage(){
    let {message, messageCombo} = this.state
    messageCombo.push(message);
    // alert(mess);
    this.setState({message:""})
  }

  render(){
    return(
      <View style={{flex:1}}>
        <FlatList
        style={{height:height*0.8}}
        data={this.state.messageCombo}
        renderItem={({item})=>(
          <View style={{backgroundColor:"#000", width:"50%", marginHorizontal:10, borderRadius:10, padding:5, marginVertical:10}}>
            <Text style={{color:"#fff", padding:10}}>{item}</Text>
          </View>
        )}/>
        <View>
          <Item rounded>
            <Input
              value={this.state.message}
              onChangeText={(value)=>this.setState({message:value})}
              placeholder="Type your message here"/>
              <TouchableOpacity
              onPress={()=>this.updateMessage()}
              >
                <Icon name="send" size={30}/>
              </TouchableOpacity>
          </Item>
        </View>
      </View>
    )
  }
}