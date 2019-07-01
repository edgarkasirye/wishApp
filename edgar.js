import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right } from 'native-base';
import type, { Notification, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase'

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
    cities:["Kampala","Rujuti","Kinshasha","Lagos","Nairobi","Mbale","Jinja","Kigali","Pretoria"],
    name:"Belinda Marion",
    phone:"0770857493",
    like:false,
    wink:false,
    message:""
  }
  // send Notification to person winked at
  winkNotify(){
    let {name, phone} = this.state
    this.setState({message:
                    "Hmm. I think somebody is interested in you. They winked at you.",
                  wink:true})
      alert(message);
      
  }

  likeNotify(){
    let {name, phone} = this.state
    this.setState({
      message:"Hmm. I think somebody is interested in you. They winked at you.",
      wink:true})
      alert(message);
  }

  subscribeToNotificationListeners() {
    const channel = new firebase.notifications.Android.Channel(
        'bmk-channel', // To be Replaced as per use
        'Bmk Channel', // To be Replaced as per use
        firebase.notifications.Android.Importance.Max
    ).setDescription('A Channel To manage the notifications related to Application');
    firebase.notifications().android.createChannel(channel);
    
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        // Process your notification as required
        this.displayNotification(notification)
    });
  }

  displayNotification = (notification) => {
    if (Platform.OS === 'android') {
      const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
      }).setNotificationId(notification.notificationId)
          .setTitle("iWish")
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('bmk-channel') // e.g. the id you chose above
          .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
          .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

    }
  }

  componentDidMount(){
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        // Process your token as required
    });

    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        // user has permissions so build the botification
        firebase.messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {
            // user has a device token
            console.log(fcmToken);
            this.subscribeToNotificationListeners();
          } else {
            // user doesn't have a device token yet
          } 
        });
        

      } else {
        firebase.messaging().requestPermission()
        .then(() => {
          // User has authorised 
          firebase.messaging().getToken()
          .then(fcmToken => {
            if (fcmToken) {
              // user has a device token
              this.subscribeToNotificationListeners();
            } else {
              // user doesn't have a device token yet
            } 
          }); 
        })
        .catch(error => {
          return;  
        });
      } 
    });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.onTokenRefreshListener();
  }


  // componentDidMount(){
  //   this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
  //     // Process your notification as required
  //     const channel = new firebase.notifications.Android.Channel('bmk-channel', 'Bmk Channel', firebase.notifications.Android.Importance.Max)
  //       .setDescription('My apps test channel');

  //       // Create the channel
  //     firebase.notifications().android.createChannel(channel);
  //     notification
  //       .android.setChannelId('bmk-channel')
  //       .android.setSmallIcon('ic_launcher');

  //     firebase.notifications().displayNotification(notification);

  //   });
  // }

  componentWillUnmount() {
    this.notificationListener();
  }

  render() {
    let {message} = this.state
    return (
      <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
      
        <Text style={{textAlign:"center",fontSize:40,marginVertical:10,fontWeight:"200"}}>iWish</Text>
        <Text>{message}</Text>
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
                onPress={()=>this.likeNotify}
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1}}>
                  <Icon name="heart" size={30} style={{textAlign:"center"}}/>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.winkNotify} 
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
