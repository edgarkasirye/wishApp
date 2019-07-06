import React, {Component} from "react"
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { Icon, Item, Input } from 'native-base'
import firebase from 'react-native-firebase'

export default class Jazz extends Component{
  constructor(){
    super();
    this.state = {
      message:"",
      userId:firebase.auth().currentUser.uid,
      otherId:"8TeAd1Q0U8boJEqt4y0IDu8lAae2",
      docId:"",
      messageCombo:[]
    }
  }

  componentDidMount(){
    this.retrieveMessage();
  }

  addMessages(){
    let {docId,otherId,userId,message} = this.state
    if(userId<otherId){
      docId=userId+otherId
    }else{
      docId=otherId+userId
    }
    // alert(docId);
    if(message.length > 0){
      firebase.firestore().collection("chats").doc(docId).update({
        messageCombo : firebase.firestore.FieldValue.arrayUnion({
          sender: firebase.auth().currentUser.displayName,
          dateCreated:new Date().getTime(),
          message:message
        })
      })
      .then(()=>{
        this.retrieveMessage();
      })
      .catch((error)=>alert(error));
    }
  }

  retrieveMessage(){
    let messageCombo = [];
    let {docId,otherId,userId} = this.state
    if(userId<otherId){
      docId=userId+otherId
    }else{
      docId=otherId+userId
    }
    // alert(docId)

    firebase.firestore().collection("chats").doc("8TeAd1Q0U8boJEqt4y0IDu8lAae2KQxiyF1DZzLpk2N0pVRKGX3Xov22").get()
    .then((querySnapshot)=>{
      // alert(querySnapshot);
      querySnapshot.forEach((doc)=>{
        // alert(doc);
        const {sender , dateCreated, message} = doc.data();
        messageCombo.push({
          key:doc.id,
          sender,
          dateCreated,
          message
        })
        this.setState({messageCombo})
        // alert(this.state.messageCombo);
        this.setState({message:""})
      })
    })
    .catch(error=>alert(error))
  }

  render(){
    let {message} = this.state
    return(
      <View style={{flex:1}}>
        <View style={{margin:20}}>
          <Item rounded>
            <Input
              onChangeText={value=>{
                this.setState({message:value})
              }}
              placeholder="Type your message here"/>
              <TouchableOpacity
              onPress={()=>this.addMessages()}
              >
                <Icon name="send" size={30}/>
              </TouchableOpacity>
          </Item>
        </View>
      </View>
    )
  }
}