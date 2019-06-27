import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Input, Item, Button, Icon, CheckBox, ListItem, Body, Content, DeckSwiper, Spinner } from 'native-base'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'

const questions = ["Full Name", "Contact" ,"Email","Occupation", "Sex", "Password", "Confirm Password", "Profile Photo", "Date of Birth"]

export default class SignUpScreen extends Component {
	state = {
		name : "",
		email:"",
		password:"",
		loading:false,
		message:"",
		sex:"",
		occupation:"",
		avatarSource:null,
		optionOne:false,
		optionTwo:false,
		contact:"",
		date:"2019-06-19"
	}

	signUp(){
		const {email, password, name, date, sex, occupation, avatarSource, contact} = this.state
		this.setState({message:"",loading:true})

		if(email && name && date  && sex  && occupation && avatarSource && contact && password){
			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(user=>{
				firebase.auth().currentUser.updateProfile({
					displayName : name,
					Image:avatarSource
				})

				let myId = firebase.database().ref("Users").child(contact).push().key;
				firebase.database().ref("Users/" + myId).child(contact)
				.push({name:name,
					avatarSource:avatarSource,occupation:occupation,date:date,contact:contact,sex:sex,email:email,password:password
					})
				firebase.database().ref().child("homeSetup")
				.push({
					name:name,
					avatarSource:avatarSource
				})
				.then(()=>this.props.navigation.navigate("Home"))
				.catch(err=>{
					alert(err)
				})
			})
			.catch(err=>{
				this.setState({loading:false, message:err})
				alert(message);
			})
		}else{
			this.setState({loading:false})
			Alert.alert(
			  'Incomplete Fields',
			  "Fill in all Fields",
			);
		}

	}

	profileSelection(){
		const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
		    console.log('User cancelled image picker');
		  } else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  } else if (response.customButton) {
		    console.log('User tapped custom button: ', response.customButton);
		  } else {
		    const source = { uri: response.uri };

		    // You can also display the image using data:
		    // const source = { uri: 'data:image/jpeg;base64,' + response.data };

		    this.setState({
		      avatarSource: source,
		    });
		  }
		});
	}

  render(){
  	const {message,loading}=this.state

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
								{item === "Date of Birth" ?
		          	<View>
									{loading ? <Spinner color='blue'/> : <Text>{message}</Text>}

									<Text style={styles.instructions}>Select a Date</Text>
									<Text style={styles.instructions}>Date: {this.state.date}</Text>
									<DatePicker
										style={{width: 200}}
										date={this.state.date}
										mode="date"
										placeholder="placeholder"
										format="YYYY-MM-DD"
										minDate="1990-05-01"
										maxDate="2020-06-01"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										customStyles={{
											dateIcon: {
												position: 'absolute',
												left: 0,
												top: 4,
												marginLeft: 0
											},
											dateInput: {
												marginLeft: 36
											}
										}}
										onDateChange={(date) => {this.setState({date: date})}}
									/>

			          	{/*<Item block rounded style={{marginHorizontal:10,marginTop:100}}>
				          	<Input placeholder={"Enter " + item}
				          	onChangeText={(value)=>this.setState({dob:value})}/>
				          </Item>*/
									}
									
			          	<Button
							      style={{backgroundColor:"#F02D3A",marginTop:100,marginLeft:180,
							      marginRight:5,borderRadius:10,width:100}}
							      onPress={()=>this.signUp()}>
							      <Text style={{textAlign:"center",color:"#ffffff"}}>Continue</Text>
							    </Button>
							    </View>:
							    <View>

									{item === "Profile Photo" ?
										<View>
											{this.state.avatarSource !== null ?
												<View>
													{/* <Text
													// style={{fontSize:25,textAlign:"center",color:"#ffffff",marginTop:-20}}>My Profile Image</Text>*/
													}
													<Image source={this.state.avatarSource}
													style={{width:300,height:350,borderRadius:10}} />
													<Button
			 	 				          	style={{
			 	 				          	borderRadius:10,backgroundColor:"#F02D3A",position:"absolute",top:300,right:10}}
			 	 				          	onPress={() => this._deckSwiper._root.swipeRight()}>
	 	           							<Text>Next</Text>
	 	         							</Button>
 											</View>
											:
											<View><View style={{marginTop:40,marginBottom:70}}>
												 <TouchableOpacity
												 style={{borderRadius:25,width:50,height:50,backgroundColor:"#F02D3A",marginLeft:120}}
		 										 onPress={this.profileSelection.bind(this)}>
												 	<Text style={{fontSize:25,textAlign:"center",color:"#ffffff",marginTop:8}}>+</Text>
												 </TouchableOpacity>
												 <Text style={{fontSize:20,textAlign:"center"}}>Select A profile Image</Text>
											 </View>
											 <Button
	 				          	style={{marginTop:50,
	 				          	marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A",zIndex:2}}
	 				          	onPress={() => this._deckSwiper._root.swipeRight()}>
	           						<Text>Next</Text>
	         						</Button>
											</View>
										}

										</View>
										:
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
					          		}else if(item === "Contact" ){
					          			this.setState({contact:value})
					          		}else if(item === "Password" ){
					          			this.setState({password:value})
					          		}
					          	}}/>
				          	</Item>
										<Button
										style={{marginTop:50,
										marginLeft:220,borderRadius:10,backgroundColor:"#F02D3A"}}
										onPress={() => this._deckSwiper._root.swipeRight()}>
											<Text>Next</Text>
										</Button></View>
									}


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

const styles = StyleSheet.create({
	instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})