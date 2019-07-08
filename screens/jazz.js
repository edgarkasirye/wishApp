import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  AsyncStorage
} from "react-native";
import { Icon, Item, Input } from "native-base";
import firebase from "react-native-firebase";
import moment from 'moment'

const {width, height} = Dimensions.get("window");

export default class Jazz extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      userId: firebase.auth().currentUser.uid,
      messageCombo: [],
    };

    //better put docId and otherId outside of the state since they aren't going
    //to be changing according to the state of your UI
    //what you had done before in chat.js is better
    this.docId;
    this.otherId = "8TeAd1Q0U8boJEqt4y0IDu8lAae2";
  }

  componentDidMount() {
    this.retrieveMessage();
  }

  addMessages() {
    let { userId, message } = this.state;

    if (userId < this.otherId) {
      this.docId = userId + this.otherId;
    } else {
      this.docId = this.otherId + userId;
    }
    // alert(docId);
    if (message.length > 0) {
      firebase
        .firestore()
        .collection("chats")
        .doc(this.docId)
        .update({
          messageCombo: firebase.firestore.FieldValue.arrayUnion({
            sender: firebase.auth().currentUser.displayName,
            dateCreated: new Date().getTime(),
            message: message
          })
        })
        .then(() => {
          this.retrieveMessage();
        })
        .catch(error => alert(error));
    }
  }

  // store messages in async storage
  //storeMessage = async ()=>{
    //await AsyncStorage.setItem(messageCombo, this.state.messageCombo);
  //}

  retrieveMessage() {
    let messageCombo = [];
    let { userId } = this.state;
    if (userId < this.otherId) {
      this.docId = userId + this.otherId;
    } else {
      this.docId = this.otherId + userId;
    }
    //alert(this.docId);

    firebase
      .firestore()
      .collection("chats")
      .doc(this.docId)
      .get()
      .then((doc) => { 
        // doc.data() retrieves the entire document of docId y
        let messageList = doc.data().messageCombo;
        messageList.forEach((msg)=>{
          messageCombo.push({
            sender:msg.sender,
            message:msg.message,
            dateCreated:msg.dateCreated
          })
        })
        this.setState({messageCombo:messageCombo,message: ""})
        //alert(this.state.messageCombo);
      })
      .catch(error => console.log(error));
  }

  // convertTime(){
  //   let dateCreated = this.state.messageCombo.dateCreated
  //   let c = new Date()
  //   let result = (dateCreated)
  // }

  render() {
    let { message } = this.state;
    //alert(this.state.messageCombo);
    return (
      <View style={{ flex: 1 }}>
        {this.state.messageCombo !== null ?
          <FlatList
          style={{height:height*0.8,padding:10}}
          data={this.state.messageCombo}
          renderItem={({item})=>(
            <View 
            style={{
              flexDirection:"row",
              width:"60%",
              alignSelf:this.state.userId?'flex-end':'flex-start',
              backgroundColor:this.state.userId?'#00897b':'#7cb342',
              borderRadius:5,
              marginBottom:10,
              justifyContent:"space-between"
            }}>
              <Text style={{color:"#fff", padding:7, fontSize:16}}>{item.message}</Text>
              <Text style={{color:"#eee",padding:3, fontSize:12,marginTop:15}}>{moment(item.dateCreated).format("LT")}</Text>
            </View>
          )}/>:null}
        <View style={{ margin: 20 }}>
          <Item rounded>
            <Input
              value={this.state.message}
              onChangeText={value => {
                this.setState({ message: value });
              }}
              placeholder="Type your message here"
            />
            <TouchableOpacity onPress={() => this.addMessages()}>
              <Icon name="send" size={30} />
            </TouchableOpacity>
          </Item>
        </View>
      </View>
    );
  }
}