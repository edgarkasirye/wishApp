import React, {Component} from 'react';
import {Icon} from 'native-base'
import {View, Text, Flatlist} from 'react-native'

const towns = ["Kampala","Rujuti","Kinshasha","Lagos","Nairobi","Mbale","Jinja","Kigali","Pretoria"];

export default class NotificationScreen extends Component {
  render() {
    return (
    <View style={{flex:1,backgroundColor:"#fff"}}>
      <Text>Did you know?</Text>
    </View>
    );
  }
}