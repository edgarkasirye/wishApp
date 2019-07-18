import firebase from 'react-native-firebase';
// Optional flow type
import type, { NotificationOpen } from 'react-native-firebase';

export default async (notificationOpen: NotificationOpen) => {
    if (notificationOpen.action1 === 'Interested!') {
        // handle the action
        // firebase
        // .firestore()
        // .collection("chats")
        // .doc(this.docId)
        // .get()
        // .then((doc) => { 
        //     // doc.data() retrieves the entire document of docId y
        //     let messageList = doc.data().messageCombo;
        //     messageList.forEach((msg)=>{
        //     messageCombo.push({
        //         sender:msg.sender,
        //         message:msg.message,
        //         dateCreated:msg.dateCreated
        //     })
        //     })
        //     this.setState({messageCombo:messageCombo,message: ""})
        //     //alert(this.state.messageCombo);
        // })
        // .catch(error => console.log(error));

    }else if(notificationOpen.action2 === 'Ignore'){
        // handle the action

    }
    
    return Promise.resolve();
}