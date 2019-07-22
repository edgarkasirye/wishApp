import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions, AsyncStorage, Animated, PanResponder, StatusBar,Easing,ToastAndroid} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right,Toast } from 'native-base';
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
      currentIndex:0,
      userName:firebase.auth().currentUser.displayName,
      scrollStatus:true,
      animatedValue: new Animated.Value(0)
    }
    this.storRef = firebase.storage().ref();
    this.dbRef = firebase.firestore().collection("users");
    this.dbWink = firebase.firestore();
    // this.position = new Animated.ValueXY();

    // this.rotate = this.position.x.interpolate({
    //   inputRange:[-width/2,0,width/2],
    //   outputRange:['-10deg','0deg','10deg'],
    //   extrapolate:'clamp'
    // })

    // this.rotateAndTranslate={
    //   transform:[{
    //     rotate:this.rotate
    //   },
    //   ...this.position.getTranslateTransform()
    //   ]
    // }
    // this.nextCardOpacity=this.position.x.interpolate({
    //   inputRange:[-width/2,0,width/2],
    //   outputRange:[1,0,1],
    //   extrapolate:'clamp'
    // })
    // this.nextCardScale=this.position.x.interpolate({
    //   inputRange:[-width/2,0,width/2],
    //   outputRange:[1,0.8,1],
    //   extrapolate:'clamp'
    // })
  }
  // send Notification to person winked at
  winkNotify(uid){
    this.setState({message:
                    "Hmm. I think somebody is interested in you. They made a bold move.",
                  wink:true})
    // create wink collection winks and person that winked

    // uid of person winked at
    firebase.firestore().collection("winks").doc(uid).get()
    .then(doc=>{
      if(doc.exists){
        firebase.firestore().collection("winks").doc(uid).update({
          winkInfo : firebase.firestore.FieldValue.arrayUnion({
            winkerName:firebase.auth().currentUser.displayName,
            winkerId:firebase.auth().currentUser.uid,
            winkedOn:new Date().getTime(),
            winkedAtId:uid
          })
        })
        .then(()=>{
          console.log("I worked!");
        })
        .catch((err)=>{
          console.log(err);
          this.setState({message:err})
          Toast.show({
            text: message,
            buttonText: "Okay",
            position: "top",
            type:"warning"
          })
          //if(err)
        })
      }else{
        firebase.firestore().collection("winks").doc(uid).set({
          winkInfo : firebase.firestore.FieldValue.arrayUnion({
            winkerName:firebase.auth().currentUser.displayName,
            winkerId:firebase.auth().currentUser.uid,
            winkedOn:new Date().getTime(),
            winkedAtId:uid
          })
        })
        .then(()=>{
          console.log("I worked!");
        })
        .catch((err)=>{
          console.log(err);
          this.setState({message:err})
          Toast.show({
            text: message,
            buttonText: "Okay",
            position: "top",
            type:"warning"
          })
          //if(err)
        })
      }
    })
    
  }

  likeNotify(){
    
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
          
          // Build an action
          const action1 = new firebase.notifications.Android.Action('Interested!', 'ic_launcher', 'Interested!');
          // This is the important line
          action1.setShowUserInterface(false);
          // Add the action to the notification
          //localNotification.android.addAction(action);
          const action2 = new firebase.notifications.Android.Action('Ignore', 'ic_launcher', 'Ignore');
          // This is the important line
          action2.setShowUserInterface(false);
          // Add the action to the notification
          localNotification.android.addAction(action1);
          localNotification.android.addAction(action2);

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
        // user has permissions so build the notification
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
            let {name,avatarSource,userId,occupation} = doc.data();
            users.push({
              userId,
              name,
              avatarSource,
              occupation
            })
          })
          this.setState({users})
          users.sort((a,b)=>{return 0.5 - Math.random()}) 
        })
        .catch(err=>alert(err));
      }
      else{
        // goto women collection
        firebase.firestore().collection("women").get()
        .then((querySnapshot)=>{
          //alert(querySnapshot)
          querySnapshot.forEach((doc)=>{
            let {name,avatarSource,userId,occupation} = doc.data();
            users.push({
              userId,
              name,
              avatarSource,
              occupation
            })
          })
          this.setState({users})
          users.sort((a,b)=>{return 0.5 - Math.random()})
        })
        .catch(err=>alert(err));
      }

    //alert(users);
  }

  changeOpacity(){
    Animated.timing(this.state.animatedValue,{
      toValue:1,
      duration:100,
      useNativeDriver:true,
      easing:Easing.linear
    }).start()
  }

  componentWillUnmount() {
    this.notificationListener();
    this.onTokenRefreshListener();
  }

  render() {
    const opacity = this.state.animatedValue.interpolate({
      inputRange:[0,0.5,1],
      outputRange:[1,0.5,0]
    })
    return (
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <StatusBar backgroundColor={'#CC167A'}/>
        <Animated.View style={{position:"absolute",width:width,height:height,opacity:opacity}}>
          <View style={{flex:1,backgroundColor:"#CC167A", justifyContent:"flex-end"}}>
            <Text 
            style={{fontSize:35,lineHeight:47,color:"#fff",width:"70%",padding:10}}>Welcome back, {this.state.userName}</Text></View>
          <View style={{flex:1,backgroundColor:"#fff"}}>
          <Text 
          style={{fontSize:25,padding:10,lineHeight:27,width:"60%",fontWeight:"700",marginTop:20}}>Let's get swiping and don't forget check other people's profiles.</Text>
          </View>
        </Animated.View>
        
        <ScrollView 
        scrollEnabled={this.state.scrollStatus}
        ref={v => this.scrollView = v}
        horizontal
        onScroll={()=> {
          this.scrollView.scrollToEnd({duration:200})
          this.changeOpacity()
          this.setState({scrollStatus:false})
        }}
        showsHorizontalScrollIndicator={false}
        style={{flexDirection:"row",marginVertical:20,}}>
          <View style={{width:width-120,padding:10,justifyContent:"center"}}></View>
          
          <Carousel
          ref={(c)=>{this._carousel = c;}}
          data={this.state.users}
          itemWidth={width}
          sliderWidth={width}
          layout={'default'}
          renderItem={({item,index})=>(
            <View style={{margin:20,flex:1}}>
              <Image source={{uri:item.avatarSource}} style={{width:null,height:height*0.8,borderRadius:15,resizeMode:"cover",}}/>
              
              <View style={{position:"absolute",bottom:-0.20,backgroundColor:"#fff",flexDirection:"row",width:width-60,marginHorizontal:10,borderRadius:10,padding:10}}>
                <View style={{marginLeft:10,}}>
                  <View>
                  {item.name.length > 10 ? 
                    <Text style={{fontSize:23}}>{item.name.slice(0,9)+'...'}</Text> :
                    (<Text style={{fontSize:23}}>{item.name}</Text>)
                  }
                  </View>
                  <Text style={{color:"#9F9A9A"}}>{item.occupation}</Text>
                </View>
                <View style={{position:"absolute",right:10,flexDirection:"row",marginTop:20}}>
                  <TouchableOpacity
                  onPress={()=>this.likeNotify()}
                  style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1.5}}>
                    <Icon name="heart" size={30} style={{textAlign:"center"}}/>
                  </TouchableOpacity>

                  <TouchableOpacity
                  onPress={()=>this.winkNotify(item.userId)}
                  style={{borderRadius:15,width:40,height:40,borderColor:"#000",padding:4, borderWidth:1.5,marginLeft:10}}>
                    <Image source={require('./svgs/wink.png')} style={{width:30,height:30}}/>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
          )}/>
        </ScrollView>
      </View>
    );
  }
}

export default Edgar;