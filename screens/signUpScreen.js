import React, { Component } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from 'react-native';
import { Text, Input, Item, Button, Icon, ListItem, Body, Content, DeckSwiper, Spinner, Form, Label, Toast,CheckBox } from 'native-base'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'

//const questions = ["Full Name", "Contact" ,"Email", "Sex", "Password"]
const questions = ["Full Name", "Email","Contact", "Occupation", "Sex", "Password", "Confirm Password" , "Date of Birth","Profile Photo"]

const {width, height} = Dimensions.get("window");

export default class SignUpScreen extends Component {
	state = {
		name: "",
		email: "",
		password: "",
		loading: false,
		message: "",
		sex: "",
		optionOne: false,
		optionTwo: false,
		contact: "",
		userName: "",
		userPhone: "",
		userInfo: null,
		occupation: "",
		avatarSource: null,
		date: "2019-06-19",
		confirmPassword:"",
		dob:new Date(),
	}

	signUp() {
		const { password, name, sex, contact, email, occupation, avatarSource, dob, confirmPassword, date, message } = this.state
		this.setState({ message: "", loading: true })

		if (email && name && dob && sex && occupation && avatarSource && contact && password ) {

			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(user => {
					//once we are logged in, move to home screen

					// current user uid
					var userId = firebase.auth().currentUser.uid;
					const db = firebase.firestore();

					firebase.storage().ref().child("img/" + new Date().getTime()).putFile(avatarSource.uri)
					  	.then((snapshot)=>{
					  		console.log("Successful!");
					  		// remove .then and .catch replace with db.coll...

					  		//add userID
							  db.collection("users").doc(userId).set({
									name: name,
									contact: contact,
									email: email,
									password: password,
									occupation:occupation,
									avatarSource: snapshot.downloadURL,
									dob:dob,
									sex:sex
								})
								.then(()=>{
									console.log("Youre in!")
										firebase.auth().currentUser.updateProfile({
											displayName: name,
											photoURL:avatarSource
										})
										// get url from 
					
										.then(()=>{
											//after updating the profile
											console.log("after updating the ....");
											
											if (sex === "Female") {
												db.collection("women").add({
													name: name,
													contact: contact,
													email: email,
													password: password,
													avatarSource: snapshot.downloadURL,
													dob:dob,
													sex:sex,
													occupation:occupation
												})
												.then((docRef)=> {
													
													console.log("Document written with ID: ", docRef.id);
													this.props.navigation.navigate('Home', { user })
												})
												.catch((error) => {
													console.log("Error adding document: ", error);
													this.setState({message:"An error while loading! Try again later",loading:false})
													Toast.show({
														text: message,
														buttonText: "Okay",
														position: "top",
														type:"danger"
													})
													// return to login preview
													this.props.navigation.navigate("LoginPreview");
												});
											} else if (sex === "Male") {
												db.collection("men").add({
													name: name,
													contact: contact,
													email: email,
													password: password,
													avatarSource:avatarSource,
													dob:dob,
													avatarSource: snapshot.downloadURL,
													occupation:occupation
												})
												.then((docRef) => {
													console.log("Document written with ID: ", docRef.id);
													this.props.navigation.navigate('Home', { user })
												})
												.catch((error) =>{
													console.log("Error adding document: ", error);
													this.setState({message:"An error while loading! Try again later",loading:false})
													Toast.show({
														text: message,
														buttonText: "Okay",
														position: "top",
														type:"danger"
													})
												// return to login preview
												this.props.navigation.navigate("LoginPreview");
												
												});
											}
					
											
										})
										.catch(error => {
											//if failure, stop the spinner and show the error message
											console.error(error);
											this.setState({message:"An error while loading! Try again later",loading:false})
											Toast.show({
												text: message,
												buttonText: "Okay",
												position: "top",
												type:"danger"
											})
											// return to login preview
											this.props.navigation.navigate("LoginPreview");
										})
									
								})
								.catch((error)=>{
									//to be returned to login preview
									console.error(error);
									this.setState({message:"An error while loading! Try again later",loading:false})
									Toast.show({
										text: message,
										buttonText: "Okay",
										position: "top",
										type:"danger"
									})
						  		// return to login preview
						  		this.props.navigation.navigate("LoginPreview");
								})
					  })
					//update user profile with name
					
				})
				.catch((error)=>{
				  //failed to update profile
					//move to home
					console.error(error);
					this.setState({message:"An error while loading! Try again later",loading:false})
					Toast.show({
						text: message,
						buttonText: "Okay",
						position: "top",
						type:"danger"
					})
		  		// return to login preview
		  		this.props.navigation.navigate("LoginPreview");
				})

		} else {
			this.setState({ loading: false, message: "Fill in all messages!" })
			Toast.show({
				text: message,
				buttonText: "Okay",
				position: "top",
				type:"warning"
			})
		}
	}

	profileSelection() {
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

	render() {
		const { message, loading, date, avatarSource, contact, dob, password } = this.state

		return (
			<ScrollView 
			showsVerticalScrollIndicator={false}
			style={{ flex: 1, backgroundColor: "#FFF" }}>
				<StatusBar backgroundColor={'#CC167A'}/>
				{loading ? <Spinner color='blue' /> :null}
				{/* <View
					style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10 }}>
					<Icon name="heart" size={50} style={{ color: "#F02D3A", marginTop: 30 }} />
					<Text style={{ textAlign: "center", color: "#F02D3A", fontSize: 50, opacity: 1 }}>
						Wish</Text>
				</View> */}
				<View style={{flexDirection:"row",padding:20,alignItems:"center"}}>
					<Text style={{fontSize:30}}>Sign Up To </Text>
					<Text style={{color:"#CC167A",fontSize:30}}>iWish</Text>
				</View>

				<View style={{ marginHorizontal: 10 }}>
					<Text style={{fontSize:25,marginHorizontal:10,paddingVertical:10}}>Personal Info</Text>
					{questions.map((item,index)=>(
					<View>
						
						{item === "Sex" ?
						<View>
							<Text style={{padding:10,fontSize:20}}>Select Gender</Text>
							<View style={{flexDirection:"row",marginVertical:5}}>
								<CheckBox 
									checked={this.state.optionOne}
									onPress={() => this.setState({ sex: "Male", optionOne: true })}
									onLongPress={() => this.setState({ sex: "", optionOne: false })} />
								<Text style={{marginLeft:20,fontSize:18,color:"#6D6D6D"}}>Male</Text>
							</View>
							<View style={{flexDirection:"row",marginVertical:5}}>
								<CheckBox checked={this.state.optionTwo}
									onPress={() => this.setState({ sex: "Female", optionTwo: true })}
									onLongPress={() => this.setState({ sex: "", optionTwo: false })} />
								<Text style={{marginLeft:20,fontSize:18,color:"#6D6D6D"}}>Female</Text>
							</View>
						</View>:
						<View>
						{item === "Confirm Password" ?
							<View>
								<Form>
									<Item fixedLabel>
										<Label style={{color:"#6D6D6D",fontSize:18}}>Confirm Password</Label>
										<Input
										secureTextEntry={true}
										onChangeText={(value)=>{
											if(value !== password){
												this.setState({message:"Password doesn't match"})
												Toast.show({
													text: message,
													buttonText: "Okay",
													position: "top",
													type:"danger"
												})
											}else if(value.length < 8){
												this.setState({message:"Password should have more than 8 characters"})
												Toast.show({
													text: message,
													buttonText: "Okay",
													position: "top",
													type:"warning"
												})
											}else{
												this.setState({message:"Password matches"})
												Toast.show({
													text: message,
													buttonText: "Okay",
													position: "top",
													type:"success"
												})
											}
										}}/>
									</Item>
								</Form>
							</View>
						:
							<View>
								{item === "Password"?
								<View>
									<Form>
										<Item fixedLabel>
											<Label style={{color:"#6D6D6D",fontSize:18}}>{item}</Label>
											<Input
											secureTextEntry={true}
											/>
										</Item>
									</Form>
								</View> :
								<View>
									{item === "Date of Birth" ?
									<View style={{marginHorizontal:10,marginVertical:15,}}>
										<Text style={{fontSize:18,}}>Date of Birth</Text>
										<DatePicker
											style={{ width: "70%" }}
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
											onDateChange={(date) => { this.setState({ dob: date, date:date }) }}
										/>
									</View> :
								<View>
									{item === "Profile Photo" ?
									<View style={{marginHorizontal:10,marginVertical:15,}}>
										{this.state.avatarSource !== null ?
											<View>
												<Image
													source={this.state.avatarSource}
													style={{ width: 90, height: 90, borderRadius: 10 }}
												/>
											</View>
											:
											<View>
												<TouchableOpacity
													style={{ borderRadius: 10, width: 200, height: 40, borderColor: "#CC167A",borderWidth:1 }}
													onPress={this.profileSelection.bind(this)}>
													<Text style={{ fontSize: 18, padding:5,color: "#000",textAlign:"center", }}>Add Profile Photo</Text>
												</TouchableOpacity>
											</View>
										}
									</View> 
									:
										<View>
											<Form>
												<Item fixedLabel>
													<Label style={{color:"#6D6D6D",fontSize:18}}>{item}</Label>
													<Input
													onChangeText={(value) => {
														if (item === "Full Name") {
															this.setState({ name: value })
														} else if (item === "Email") {
															this.setState({ email: value })
														} else if (item === "Contact") {
															this.setState({ contact: value })
														} else if (item === "Occupation") {
															this.setState({ occupation: value })
														}
													}}/>
												</Item>
											</Form>
										</View>
									}
									</View>
								}
									
								</View>
								}
								
							</View>
						}
					</View>
						}
					</View>
					
				))}
				</View>
				<Button
					block
					style={{
						backgroundColor: "#CC167A", margin:15, borderRadius: 10
					}}
					onPress={() => this.signUp()}>
					<Text style={{ textAlign: "center", color: "#ffffff" }}>Continue</Text>
				</Button>
    	</ScrollView>
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
