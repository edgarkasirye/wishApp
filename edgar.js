import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import Carousel from 'react-native-snap-carousel';

export default class Edgar extends Component {
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
    ]
  }
  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
            <Icon name="ios-menu" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <View>
         <Text style={{fontSize:18, alignSelf:"center", fontFamily:"Roboto"}}>Choose a date</Text>
        </View>
        <View style={{flexDirection:"row",marginLeft:-300,}}>
       <Carousel
       ref={(c) => { this._carousel = c; }}
       data={this.state.images}
       sliderWidth={300}
       itemWidth={300}
       style={{margin:0}}
       renderItem={(item,index)=>(
         <View style={{marginLeft:0, borderColor:"black"}}>
           <Image source={item.index} style={{width:null,height:300}}/>
           <View style={{right:8, position:"absolute", bottom:0, padding: 5}}>
            <Icon name="ios-call" style={{color:"white", fontSize: 50}}/>
           </View>
          </View>
       )}
       />
       </View>
       <View>
         
       </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
 
});
