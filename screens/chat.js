import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { Icon, Item, Input } from 'native-base'
import firebase from 'react-native-firebase'

const {width, height} = Dimensions.get("window");

export default class Chat extends Component{
  constructor(){
    super();
    state={
      messageCombo:[],
      message:"",
    }
    this.userId = firebase.auth().currentUser.uid;
    this.otherId = "8TeAd1Q0U8boJEqt4y0IDu8lAae2";
    this.docId = this.userId<this.otherId?this.userId+this.otherId:this.otherId+this.userId;
  }

  componentDidMount(){
    this.retrieveMessages();
  }

  addMessages(){
    let {message} = this.state
    alert(message);

    // access or update doc
    if(message.length > 0){
      firebase.firestore().collection("chats").doc(docId).set({
        messageCombo : firebase.firestore.FieldValue.arrayUnion({
          sender: firebase.auth().currentUser.displayName,
          dateCreated:new Date().getTime(),
          message:message
        })
      })
      .then(()=>{
        this.retrieveMessages();
      })
      .catch((error)=>console.log(error));
    }
  }

  retrieveMessages(){
    // get messages from firestore collection message
    let messageCombo = [];
    alert(this.docId);
    firebase.firestore().collection("chats").doc(this.docId).get()
    .then((querySnapshot)=>{
      console.log(querySnapshot)
      querySnapshot.forEach((doc)=>{
        console.log(doc);
        const {sender , dateCreated, message} = doc.data();
        messageCombo.push({
          key:doc.id,
          sender,
          dateCreated,
          message
        })
        this.setState({messageCombo})
        console.log(messageCombo);
        this.setState({message:""})
      })
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  render(){
    let {messageCombo} = this.state
    //alert(messageCombo)
    return(
      <View style={{flex:1}}>
        {messageCombo !== null ?
        <FlatList
        style={{height:height*0.8}}
        data={messageCombo}
        renderItem={({item})=>(
          <View style={{backgroundColor:"#000", width:"50%", marginHorizontal:10, borderRadius:10, padding:5, marginVertical:10}}>
            <Text style={{color:"#fff", padding:10}}>{item.message}</Text>
            <Text style={{color:"#fff", padding:10}}>{item.dateCreated}</Text>
          </View>
        )}/>:null}
        
        <View style={{margin:20}}>
          <Item rounded>
            <Input
              onChangeText={value=>{
                this.setState({message:value})
                // console.log(message);
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
