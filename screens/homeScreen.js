import React, {Component} from 'react';
import Edgar from '../edgar'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {Icon} from 'native-base'
import {View, Text} from 'react-native'
import ProfileScreen from './profileScreen';
import MainChat from './mainChat';
import NotificationScreen from './notificationsScreen'

class HomeScreen extends Component {
  render() {
    return (
    <Edgar/>
    );
  }
}

export default createMaterialBottomTabNavigator({
  Home:{
    screen:HomeScreen,
    navigationOptions:{
      tabBarLabel : 'Home',
      tabBarIcon:({tintColor})=>(
        <Icon name="home" color={tintColor} size={24}/>
      ),
      activeTintColor:'#d33e43'
    }
  },
/*
  Notifications:{
    screen:NotificationScreen,
    navigationOptions:{
      tabBarLabel : 'Notifications',
      tabBarIcon:({tintColor})=>(
        <Icon name="notifications-outline" color={tintColor} size={24}/>
      ),
      activeTintColor:'#000'
    }

  },*/
  MainChat:{
    screen:MainChat,
    navigationOptions:{
      tabBarLabel : 'Chat',
      tabBarIcon:({tintColor})=>(
        <Icon name="chatbubbles" color={tintColor} size={24}/>
      ),
      activeTintColor:'#d33e43'
    }
  },
  Profile:{
    screen:ProfileScreen,
    navigationOptions:{
      tabBarLabel : 'Profile',
      tabBarIcon:({tintColor})=>(
        <Icon name="person" color={tintColor} size={24}/>
      ),
      activeTintColor:'#d33e43'
    }
  }
},{
  initialRouteName:"Home",
  activeColor: '#000',
  inactiveColor: '#3e2465',
  barStyle: { backgroundColor: '#ffffff' },
  shifting:true,
  defaultNavigationOptions:{
    header:null
  }
})
