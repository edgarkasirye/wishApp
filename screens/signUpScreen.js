import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Input, Item, Button, Icon, CheckBox, ListItem, Body, Content, DeckSwiper, Spinner } from 'native-base'
import firebase from 'react-native-firebase'

const questions = ["Full Name", "Contact" ,"Email", "Sex", "Password"]

export default class SignUpScreen extends Component {
	state = {
		name : "",
		email:"",
		password:"",
		loading:false,
		message:"",
		sex:"",
		optionOne:false,
		optionTwo:false,
		contact:"",
		userName:"",
		userPhone:"",
		userInfo:null,
	}

	signUp(){
		const {password, name, sex, contact, email} = this.state
		this.setState({message:"",loading:true})

		if(password && name && sex && contact && email){
			firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        //once we are logged in, move to home screen
        //update user profile with name
        // firebase.auth().currentUser.updateProfile({
        //   displayName: name
        // })
        // .then(()=>{
        //   //after updating the profile
        //   this.props.navigation.navigate('Home')
        // })
        // .catch((err)=>{
        //   //failed to update profile
				// 	//move to home
					
        //   this.setState({loading:false, message:err.message})
				// })
				console.log("Am in");
        this.props.navigation.navigate('Home', {user})
      })
      .catch(err=>{
        //if failure, stop the spinner and show the error message
				this.setState({loading:false, message:err.message})
				console.log(message);
			})
			console.log(message);
		}else{
			this.setState({loading:false, message:"Fill in all messages!"})
			console.log(message);
		}
	}

  render(){
  	const {message,loading}=this.state

    return (
    <View style={{flex:1,backgroundColor:"#F02D3A"}}>
			{loading ? <Spinner color='blue'/> : 
			<Text style={{color:"#fff",fontSize:18}}>{message}</Text>}
			
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
			            <CheckBox checked={this.state.optionOne}
			            onPress={()=>this.setState({sex:"Male",optionOne:true})}
									onLongPress={()=>this.setState({sex:"",optionOne:false})}/>
			            <Body>
			              <Text>Male</Text>
			            </Body>
			          </ListItem>
			          <ListItem>
			            <CheckBox checked={this.state.optionTwo}
			            onPress={()=>this.setState({sex:"Female",optionTwo:true})}
									onLongPress={()=>this.setState({sex:"",optionTwo:false})}/>
			            <Body>
			              <Text>Female</Text>
			            </Body>
			          </ListItem>

      					<Button
		          	style={{marginTop:50,marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A"}}
		          	onPress={() => this._deckSwiper._root.swipeRight()}>
      						<Text>Next</Text>
    						</Button>
		          </Content> :
		          <View>
								{item === "Password" ?
			          	<View>
				          	<Item block rounded style={{marginHorizontal:10,marginTop:100}}>
					          	<Input 
					          	secureTextEntry={true}
					          	placeholder={"Enter " + item}
					          	onChangeText={(value)=>this.setState({password:value})}/>
					          </Item>

				          	<Button
								      style={{backgroundColor:"#F02D3A",marginTop:100,marginLeft:180,
								      marginRight:5,borderRadius:10,width:100}}
								      onPress={()=>this.signUp()}>
								      <Text style={{textAlign:"center",color:"#ffffff"}}>Continue</Text>
								    </Button>
							    </View>
							    :
									<View>
										<Item rounded style={{marginHorizontal:12,marginTop:100,marginLeft:10}}>
					          	<Input
					          	placeholder={"Enter " + item}
					          	onChangeText={(value)=>{
					          		if(item === "Full Name" ){
					          			this.setState({name:value})
					          		}else if(item === "Email" ){
					          			this.setState({email:value})
					          		}else if(item === "Contact" ){
					          			this.setState({contact:value})
					          		}
					          	}}/>
				          	</Item>
										<Button
										style={{marginTop:50,
										marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A"}}
										onPress={() => this._deckSwiper._root.swipeRight()}>
											<Text>Next</Text>
										</Button>
									</View>
									}
				          </View>
		          	}
		      	</View>
		      )}}
		     />
	     </View>
    </View>
    );
  }
}