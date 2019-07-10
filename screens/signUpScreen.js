import React, { Component } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Input, Item, Button, Icon, CheckBox, ListItem, Body, Content, DeckSwiper, Spinner } from 'native-base'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'

//const questions = ["Full Name", "Contact" ,"Email", "Sex", "Password"]
const questions = ["Full Name", "Contact", "Email", "Occupation", "Sex", "Profile Photo", "Date of Birth", "Password", "Confirm Password"]

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

					//update user profile with name
					firebase.auth().currentUser.updateProfile({
					  displayName: name
					})

					.then(()=>{
						//after updating the profile
						console.log("after updating the ....");
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
									if (sex === "Female") {
										db.collection("women").add({
											name: name,
											contact: contact,
											email: email,
											password: password,
											occupation:occupation,
											avatarSource: snapshot.downloadURL,
											dob:dob,
											sex:sex
										})
										.then((docRef)=> {
											console.log("Document written with ID: ", docRef.id);
											this.props.navigation.navigate('Home', { user })
										})
										.catch((error) => {
											console.log("Error adding document: ", error);
											this.setState({message:"An error while loading! Try again later",loading:false})
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
										})
										.then((docRef) => {
											console.log("Document written with ID: ", docRef.id);
											this.props.navigation.navigate('Home', { user })
										})
										.catch((error) =>{
											console.log("Error adding document: ", error);
											this.setState({message:"An error while loading! Try again later",loading:false})
							  		// return to login preview
							  		this.props.navigation.navigate("LoginPreview");
							  		
										});
									}
								})
								.catch((error)=>{
									//to be returned to login preview
									console.error(error);
						  		this.setState({message:"An error while loading! Try again later",loading:false})
						  		// return to login preview
						  		this.props.navigation.navigate("LoginPreview");
								})
					  })
					})
					.catch(error => {
						//if failure, stop the spinner and show the error message
						console.error(error);
						this.setState({message:"An error while loading! Try again later",loading:false})
			  		// return to login preview
			  		this.props.navigation.navigate("LoginPreview");
					})
				})
				.catch((error)=>{
				  //failed to update profile
					//move to home
					console.error(error);
				  this.setState({message:"An error while loading! Try again later",loading:false})
		  		// return to login preview
		  		this.props.navigation.navigate("LoginPreview");
				})

		} else {
			this.setState({ loading: false, message: "Fill in all messages!" })
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
			<View style={{ flex: 1, backgroundColor: "#F02D3A" }}>
				{loading ? <Spinner color='blue' /> :
					<Text style={{ color: "#fff", fontSize: 18, textAlign:"center", marginTop:20 }}>{message}</Text>}
				<View
					style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10 }}>
					<Icon name="heart" size={50} style={{ color: "#F02D3A", marginTop: 30 }} />
					<Text style={{ textAlign: "center", color: "#F02D3A", fontSize: 50, opacity: 1 }}>
						Wish</Text>
				</View>

				{/*In charge of swipeable stack of cards containing info to be filled and used for profile screen*/}
				<View style={{ marginHorizontal: 10 }}>
					<DeckSwiper
						ref={(c) => this._deckSwiper = c}
						style={{ width: 300, height: 350 }}
						dataSource={questions}
						renderItem={(item, index) => {
							return (
								<View
									style={{ borderRadius: 10, width: null, height: 350, backgroundColor: "#ffffff" }}>
									{item === "Sex" ?
										<Content style={{ marginTop: 30 }}>
											<Text style={{ margin: 10, fontSize: 25 }}>Choose Sex</Text>
											<ListItem>
												<CheckBox checked={this.state.optionOne}
													onPress={() => this.setState({ sex: "Male", optionOne: true })}
													onLongPress={() => this.setState({ sex: "", optionOne: false })} />
												<Body>
													<Text>Male</Text>
												</Body>
											</ListItem>
											<ListItem>
												<CheckBox checked={this.state.optionTwo}
													onPress={() => this.setState({ sex: "Female", optionTwo: true })}
													onLongPress={() => this.setState({ sex: "", optionTwo: false })} />
												<Body>
													<Text>Female</Text>
												</Body>
											</ListItem>
											<Button
												style={{ marginTop: 50, marginLeft: 220, borderRadius: 10, backgroundColor: "#F02D3A" }}
												onPress={() => this._deckSwiper._root.swipeRight()}>
												<Text>Next</Text>
											</Button>
										</Content>
										:
										<View>
											{item === "Password" ?
											<View>
												<Item block rounded style={{ marginHorizontal: 10, marginTop: 100 }}>
													<Input
														secureTextEntry={true}
														placeholder={"Enter " + item}
														onChangeText={(value) => this.setState({ password: value })}/>
												</Item>
												<Button
													style={{
														marginTop: 50,
														marginLeft: 220, borderRadius: 10, backgroundColor: "#F02D3A"
													}}
													onPress={() => this._deckSwiper._root.swipeRight()}>
													<Text>Next</Text>
												</Button>
											</View>
											:
											<View>
												{item === "Date of Birth" ?
												<View>
													<Text style={styles.instructions}>Select a Date</Text>
													<Text style={styles.instructions}>Date: {this.state.date}</Text>
													<DatePicker
														style={{ width: 200 }}
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
													<Button
														style={{
															marginTop: 50,
															marginLeft: 220, borderRadius: 10, backgroundColor: "#F02D3A"
														}}
														onPress={() => this._deckSwiper._root.swipeRight()}>
														<Text>Next</Text>
													</Button>
												</View> :
												<View>
													{item === "Profile Photo" ?
													<View>
														{this.state.avatarSource !== null ?
															<View>
																<Image
																	source={this.state.avatarSource}
																	style={{ width: 100, height: 100, borderRadius: 50 }}
																/>
																<Button
																	style={{
																		borderRadius: 10, backgroundColor: "#F02D3A", position: "absolute", top: 300, right: 10
																	}}
																	onPress={() => this._deckSwiper._root.swipeRight()}>
																	<Text>Next</Text>
																</Button>
															</View>
															:
															<View>
																<View style={{ marginTop: 40, marginBottom: 70 }}>
																	<TouchableOpacity
																		style={{ borderRadius: 25, width: 50, height: 50, backgroundColor: "#F02D3A", marginLeft: 120 }}
																		onPress={this.profileSelection.bind(this)}>
																		<Text style={{ fontSize: 25, textAlign: "center", color: "#ffffff", marginTop: 8 }}>+</Text>
																	</TouchableOpacity>
																	<Text style={{ fontSize: 20, textAlign: "center" }}>Select A profile Image</Text>
																</View>
																<Button
																	style={{
																		marginTop: 50,
																		marginLeft: 220, borderRadius: 10, backgroundColor: "#F02D3A", zIndex: 2
																	}}
																	onPress={() => this._deckSwiper._root.swipeRight()}>
																	<Text>Next</Text>
																</Button>
															</View>
														}
													</View>:
													<View>
														{item === "Confirm Password" ?
														<View>
															<Item rounded style={{ marginHorizontal: 12, marginTop: 100, marginLeft: 10 }}>
																<Input
																placeholder="Confirm Password"
																secureTextEntry={true}
																onChangeText={(value)=>{
																	if(value !== password){
																		this.setState({message:"Password doesn't match"})
																	}else if(value.length < 8){
																		this.setState({message:"Password should have more than 8 characters"})
																	}else{
																		this.setState({message:"Password matches"})
																	}
																}}/>
															</Item>
															<Button
																style={{
																	backgroundColor: "#F02D3A", marginTop: 100, marginLeft: 180,
																	marginRight: 5, borderRadius: 10, width: 100
																}}
																onPress={() => this.signUp()}>
																<Text style={{ textAlign: "center", color: "#ffffff" }}>Continue</Text>
															</Button>
														</View>
														:
														<View>
															<Item rounded style={{ marginHorizontal: 12, marginTop: 100, marginLeft: 10 }}>
																<Input
																placeholder={"Enter " + item}
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
															<Button
																style={{
																	marginTop: 50,
																	marginLeft: 220, borderRadius: 10, backgroundColor: "#F02D3A"
																}}
																onPress={() => this._deckSwiper._root.swipeRight()}>
																<Text>Next</Text>
															</Button>
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
						)}}/>
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
