import React, {Component} from 'react';
import { Platform, StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { Text, Input, Item, Button, Icon, CheckBox, ListItem, Body, Content, DeckSwiper } from 'native-base'
import Carousel from 'react-native-snap-carousel'
import firebase from 'react-native-firebase'

const questions = ["Full Name","Email","Occupation", "Password", "Sex", "Date of Birth"]

export default class SignUpScreen extends Component {
	state = {
		name : "",
		email:"",
		dob:"",
		password:"",
		loading:false,
		message:"",
		sex:"",
		occupation:""
	}

	signUp(){
		const {email, password, name, dob, sex, occupation, message} = this.state
		this.setState({message:"",loading:true})

		if(email !== '' || name !== '' || dob !== '' || sex !== '' || occupation !== ''){
			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(user=>{
				firebase.auth().currentUser.updateProfile({
					displayName : name
				})
				.then(()=>this.props.navigation.navigate("Home"))
				.catch(err=>{
					this.props.navigation.navigate("Home")
				})
			})
			.catch(err=>{
				this.setState({loading:false,message:err})
			})
		}else{
			this.setState({loading:false})
			Alert.alert(
			  'Incomplete Fields',
			  "Fill in all Fields",
			  [
			    {text: null},
			    {
			      text: 'Cancel',
			      onPress: () => console.log('Cancel Pressed'),
			      style: 'cancel',
			    },
			    {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  {cancelable: false},
			);
		}

	}
	
  render(){
  	const {message,loading}=this.state
  	let marginLeft;

    return (
    <View style={{flex:1,backgroundColor:"#F02D3A"}}>

    	<View 
    	style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:10}}>
    		<Icon name="heart" size={50} style={{color:"#F02D3A",marginTop:30}}/>
    		<Text style={{textAlign:"center",color:"#F02D3A",fontSize:50,opacity:1}}>
      Wish</Text>
    	</View>

    	<View style={{marginHorizontal:10}}>
	    	<DeckSwiper
	    	  ref={(c) => this._deckSwiper = c}
	    	  style={{width:300,height:350}}
		      dataSource={questions}
		      renderItem={(item,index)=>{
		      	return(

		      	<View 
		      	style={{borderRadius:10,width:null,height:350,backgroundColor:"#ffffff"}}>

		      		{item === "Sex" ? 
		      		<Content style={{marginTop:30}}>
		      			<Text style={{margin:10,fontSize:25}}>Choose Sex</Text>
			      		<ListItem>
			            <CheckBox checked={item==="sex"?true:false} 
			            onPress={()=>this.setState({sex:"Male"})}/>
			            <Body>
			              <Text>Male</Text>
			            </Body>
			          </ListItem>
			          <ListItem>
			            <CheckBox checked={item==="sex"?true:false} 
			            onPress={()=>this.setState({sex:"Female"})}/>
			            <Body>
			              <Text>Female</Text>
			            </Body>
			          </ListItem>
			          <Button 
		          	style={{marginTop:100,marginRight:180,
					      marginLeft:10,borderRadius:10,width:100,backgroundColor:"#F02D3A"}} 
		          	onPress={() => this._deckSwiper._root.swipeLeft()}>
        					<Text>Previous</Text>
      					</Button>
      					<Button 
		          	style={{marginTop:item === "Full Name" ? 50 : -45,
		          	marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A"}} 
		          	onPress={() => this._deckSwiper._root.swipeRight()}>
      						<Text>Next</Text>
    						</Button>
		          </Content> : 
		          <View>
		          	{item === "Date of Birth" ?
		          	<View>
			          	<Item block rounded style={{marginHorizontal:10,marginTop:100}}> 
				          	<Input placeholder={"Enter " + item} 
				          	onChangeText={(value)=>this.setState({dob:value})}/>
				          </Item>
			          	<Button
							      style={{backgroundColor:"#F02D3A",marginTop:100,marginLeft:180,
							      marginRight:5,borderRadius:10,width:100}}
							      onPress={()=>this.signUp()}>
							      <Text style={{textAlign:"center",color:"#ffffff"}}>Continue</Text>
							    </Button>
							    </View>: 
							    <View>
									<Item rounded style={{marginHorizontal:12,marginTop:100,marginLeft:10}}>
					          	<Input 
					          	placeholder={"Enter " + item} 
											secureTextEntry={item==='Password' ? true: false}
					          	onChangeText={(value)=>{
					          		if(item === "Full Name" ){
					          			this.setState({name:value})
					          		}else if(item === "Email" ){
					          			this.setState({email:value})
					          		}else if(item === "Occupation" ){
					          			this.setState({occupation:value})
					          		}else if(item === "Date of Birth" ){
					          			this.setState({dob:value})
					          		}else if(item === "Password" ){
					          			this.setState({password:value})
					          		}
					          	}}/>
				          	</Item>

				          	{item === "Full Name" ? null:<Button 
				          	style={{marginTop:100,marginRight:180,
							      marginLeft:10,borderRadius:10,width:100,backgroundColor:"#F02D3A"}} 
				          	onPress={() => this._deckSwiper._root.swipeLeft()}>
            					<Text>Previous</Text>
          					</Button>
          					}

				          	<Button 
				          	style={{marginTop:item === "Full Name" ? 50 : -45,
				          	marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A"}} 
				          	onPress={() => this._deckSwiper._root.swipeRight()}>
          						<Text>Next</Text>
        						</Button>
				          </View> 
		          	}
		          </View>}
		      	</View>
		      )}}
		     />
	     </View>      
    </View>
    );
  }
}