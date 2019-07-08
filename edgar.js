import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image,ScrollView, TouchableOpacity, FlatList, Dimensions, AsyncStorage} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Right } from 'native-base';
import type, { Notification, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase'

const {width, height} = Dimensions.get("window");

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
      winkerId:""
    }
    this.storRef = firebase.storage().ref();
    this.dbRef = firebase.firestore().collection("users");
    this.dbWink = firebase.firestore();

  }
  // send Notification to person winked at
  winkNotify(key){
    this.setState({message:
                    "Hmm. I think somebody is interested in you. They made a bold move.",
                  wink:true})
    // create wink collection winks and person that winked
    firebase.firestore().collection("winks").doc(key).set({
        winkInfo : firebase.firestore.FieldValue.arrayUnion({
        winkerName:firebase.auth().currentUser.displayName,
        winkerId:firebase.auth().currentUser.uid
      })
    })
    .then(()=>{
      alert("I worked!");
    })
    .catch((err)=>{
      console.log(err);
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
          .android.setPriority(firebase.notifications.Android.Priority.High);

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
            let {name,avatarSource} = doc.data();
            users.push({
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
            let {name,avatarSource} = doc.data();
            users.push({
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

  componentWillUnmount() {
    this.notificationListener();
    this.onTokenRefreshListener();
  }

  render() {

    return (
      <ScrollView style={{flex:1,backgroundColor:"#fff"}}>

       <Text style={{textAlign:"center",fontSize:40,marginVertical:10,fontWeight:"200"}}>iWish</Text>
       <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginLeft:10,flexDirection:"row"}}>
          {this.state.users.map((item,index)=>(
            <View style={{marginHorizontal:10}}>
              <TouchableOpacity
              style={{borderColor:"#F02D3A",width:66,height:66,borderRadius:33,borderWidth:1.5}}>
                <Image source={{uri:item.avatarSource}} style={{width:60,height:60,borderRadius:30,margin:2}}/>
              </TouchableOpacity>
              <Text style={{textAlign:"center"}}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={{fontSize:20,marginHorizontal:15,marginTop:10}}>Discover</Text>

        <View style={{marginHorizontal:10}}>
        {this.state.users.map((item,index)=>(
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
                onPress={()=>this.winkNotify(item.key, item.name, item.avatarSource)}
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