import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions, AsyncStorage, Animated, PanResponder, StatusBar} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right } from 'native-base';
import type, { Notification, NotificationOpen } from 'react-native-firebase';
import Carousel from 'react-native-snap-carousel'
import { scrollInterpolators,animatedStyles } from './reusables/animation';

import firebase from 'react-native-firebase'

const {width, height} = Dimensions.get("window");

const horizontalMargin = 10;
const slideWidth = 365;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 300;

class Edgar extends Component {

  constructor(){
    super();
    this.state = {
      cities:["Kampala","Rujuti","Kinshasha","Lagos","Nairobi","Mbale","Jinja","Kigali","Pretoria"],
      users:[],
      like:false,
      wink:false,
      message:"",
      sex:"",
      winkerName:"",
      winkerId:"",
      currentIndex:0
    }
    this.storRef = firebase.storage().ref();
    this.dbRef = firebase.firestore().collection("users");
    this.dbWink = firebase.firestore();
    this.position = new Animated.ValueXY();

    this.rotate = this.position.x.interpolate({
      inputRange:[-width/2,0,width/2],
      outputRange:['-10deg','0deg','10deg'],
      extrapolate:'clamp'
    })

    this.rotateAndTranslate={
      transform:[{
        rotate:this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
    this.nextCardOpacity=this.position.x.interpolate({
      inputRange:[-width/2,0,width/2],
      outputRange:[1,0,1],
      extrapolate:'clamp'
    })
    this.nextCardScale=this.position.x.interpolate({
      inputRange:[-width/2,0,width/2],
      outputRange:[1,0.8,1],
      extrapolate:'clamp'
    })
  }
  // send Notification to person winked at
  winkNotify(uid){
    this.setState({message:
                    "Hmm. I think somebody is interested in you. They made a bold move.",
                  wink:true})
    // create wink collection winks and person that winked

    // uid of person winked at
    firebase.firestore().collection("winks").doc(uid).update({
        winkInfo : firebase.firestore.FieldValue.arrayUnion({
        winkerName:firebase.auth().currentUser.displayName,
        winkerId:firebase.auth().currentUser.uid,
        winkedOn:new Date().getTime(),
        winkedAtId:uid
      })
    })
    .then(()=>{
      alert("I worked!");
    })
    .catch((err)=>{
      alert(err);
      //if(err)
    })
  }

  likeNotify(){
    // let {name, phone} = this.state
    // this.setState({
    //   message:"Hmm. I think somebody is interested in you. They like you.",
    //   wink:true})
    //   alert(message);
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
          .android.setPriority(firebase.notifications.Android.Priority.High)
          
          const action = new firebase.notifications.Android.Action('Ignore','ic_launcher','Ignore')
          localNotification.android.addAction(action);

      firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.log(err));

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
            //alert(fcmToken);
            let uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection("fcmTokens").doc(uid).set({
              token:fcmToken
            })
            .then(()=>console.log("success saving token"))
            .catch((err)=>console.log("failure saving token"))
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
              let uid = firebase.auth().currentUser.uid;
              firebase.firestore.collection("fcmTokens").doc(uid).set({
                token:fcmToken
              })
              .then(()=>console.log("success saving token"))
              .catch((err)=>console.log("failure saving token"))
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

    // get images from firestore
    var userId = firebase.auth().currentUser.uid;
    console.log(userId)
    // save to asyncstorage and check there first
    this.dbRef.doc(userId).get()
    .then(this.onCollectionUpdate)
    .catch(err=>alert(err));
  }

  onCollectionUpdate = (querySnapshot)=>{
    // alert(querySnapshot);
    // alert(JSON.stringify(this.state))
    let users = [];
    //alert(querySnapshot);
    let userData = querySnapshot.data();
    //alert(JSON.stringify(userData))
    // determine current user gender
      if(userData.sex === "Female"){
        // goto men collection
        firebase.firestore().collection("men").get()
        .then((querySnapshot)=>{
          //alert(querySnapshot)
          querySnapshot.forEach((doc)=>{
            let {name,avatarSource,uid} = doc.data();
            users.push({
              uid,
              name,
              avatarSource
            })
          })
          this.setState({users}) 
        })
        .catch(err=>alert(err));
      }
      else{
        // goto women collection
        firebase.firestore().collection("women").get()
        .then((querySnapshot)=>{
          //alert(querySnapshot)
          querySnapshot.forEach((doc)=>{
            let {name,avatarSource,uid} = doc.data();
            users.push({
              uid,
              name,
              avatarSource
            })
          })
          this.setState({users})
        })
        .catch(err=>alert(err));
      }

    //alert(users);
  }

  componentWillMount(){
    this.PanResponder=PanResponder.create({
      onStartShouldSetPanResponder:(evt,gestureState)=>true,
      onPanResponderMove:(evt,gestureState)=>{
        this.position.setValue({x:gestureState.dx,y:gestureState.dy})
      },
      onPanResponderRelease:(evt,gestureState)=>{
        if(gestureState.dx > 120){
          Animated.spring(this.position,{
            toValue:{x:width+100,y:gestureState.dy}
          }).start(()=>{
            this.setState({currentIndex:this.state.currentIndex+1},()=>{
              this.position.setValue({x:0,y:0})
            })
          })
        }
        else if(gestureState.dx < -120){
          Animated.spring(this.position,{
            toValue:{x:-width-100,y:gestureState.dy}
          }).start(()=>{
            this.setState({currentIndex:this.state.currentIndex+1},()=>{
              this.position.setValue({x:0,y:0})
            })
          })
        }else{
          Animated.spring(this.position,{
            toValue:{x:0,y:0},
            friction:4
          }).start()
        }
      }
    })
  }

  componentWillUnmount() {
    this.notificationListener();
    this.onTokenRefreshListener();
  }

  render() {

    return (
      <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
        <StatusBar backgroundColor={'#d33e43'}/>
        
       {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginHorizontal:10,flexDirection:"row"}}>
          {this.state.users.map((item,index)=>(
            <View key={item.id} style={{marginHorizontal:10}}>
              <TouchableOpacity
              style={{borderColor:"#F02D3A",width:66,height:66,borderRadius:33,borderWidth:1.5}}>
                <Image source={{uri:item.avatarSource}} style={{width:60,height:60,borderRadius:30,margin:2}}/>
              </TouchableOpacity>
              <Text style={{textAlign:"center"}}>{item.name}</Text>
            </View>
          ))}
        </ScrollView> */}
        {/*<FlatList
        horizontal
        data={this.state.users}
        keyExtractor={item=>item.id}
        renderItem={({item,index})=>(
          <View style={{marginHorizontal:10}}>
              <TouchableOpacity
              style={{borderColor:"#F02D3A",width:66,height:66,borderRadius:33,borderWidth:1.5}}>
                <Image source={{uri:item.avatarSource}} style={{width:60,height:60,borderRadius:30,margin:2}}/>
              </TouchableOpacity>
              <Text style={{textAlign:"center"}}>{item.name}</Text>
            </View>
        )}/>*/}
        <View style={{flex:1}}>
          <Text style={{fontSize:25,marginHorizontal:15,paddingTop:10,fontWeight:'400'}}>Discover</Text>
        {/*this.state.users.map((item,index)=>(
          <View style={{marginVertical:10}}>
            <Image source={{uri:item.avatarSource}} style={{width:width-20,height:300,borderRadius:15}}/>
            <View style={{flexDirection:"row",marginVertical:10}}>
              <Image source={{uri:item.avatarSource}} style={{width:60,height:60,borderRadius:30}}/>
              <View style={{marginLeft:10,marginTop:5}}>
                <Text style={{fontSize:18}}>{item.name}</Text>
                <Text style={{color:"#9F9A9A"}}>{this.state.cities[index]}</Text>
              </View>
              <View style={{position:"absolute",right:10,flexDirection:"row",marginTop:10}}>
                <TouchableOpacity
                onPress={()=>this.likeNotify()}
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1}}>
                  <Icon name="heart" size={30} style={{textAlign:"center"}}/>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.winkNotify(item.uid)}
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1,marginLeft:10}}>
                  <Image source={require('./svgs/wink.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
        */}

        <Carousel
        ref={(c)=>{this._carousel = c;}}
        data={this.state.users}
        itemWidth={itemWidth}
        sliderWidth={sliderWidth}
        layout={'tinder'}
        style={{flex:1}}
        renderItem={({item,index})=>(
          <View style={{marginVertical:10}}>
            <Image source={{uri:item.avatarSource}} style={{width:null,height:height-160,borderRadius:15}}/>
            <View style={{flexDirection:"row",marginVertical:10,backgroundColor:"#fff",flex:1,
            marginTop:-90,padding:10,borderRadius:15,marginHorizontal:10}}>
              <Image source={{uri:item.avatarSource}} style={{width:60,height:60,borderRadius:30,shadowColor:"#d3d3d3",shadowOffset:{width:0,height:10}}}/>
              <View style={{marginLeft:10,marginTop:5}}>
                <View>
                {item.name > 15 ? 
                  <Text style={{fontSize:23}}>{item.name.slice(0,15)+'...'}</Text> :
                  (<Text style={{fontSize:23}}>{item.name}</Text>)
                }
                </View>
                <Text style={{color:"#9F9A9A"}}>{this.state.cities[index]}</Text>
              </View>
              <View style={{position:"absolute",right:10,flexDirection:"row",marginTop:20}}>
                <TouchableOpacity
                onPress={()=>this.likeNotify()}
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1.5}}>
                  <Icon name="heart" size={30} style={{textAlign:"center"}}/>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.winkNotify(item.uid)}
                style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1.5,marginLeft:10}}>
                  <Image source={require('./svgs/wink.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}/>
        </View>
      </ScrollView>
    );
  }
}

export default Edgar;