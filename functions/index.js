// import cloud functions and admin sdk modules

//to create cloud functions and setup triggers
const functions = require('firebase-functions');
//to access firebase db
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const db = admin.firestore();
const messaging = admin.messaging();

exports.sendWinkedNotification = 
	functions.firestore.document('winks/{winkId}').
		onUpdate((change,context)=>{
			//console.log('[changed]');
			const winks = change.after.data();
			const {winkInfo} = winks;
			let lastWink = winkInfo[winkInfo.length-1];
			let {winkedAtId,winkerName} = lastWink;

			db.collection('fcmTokens').doc(winkedAtId).get()
			.then(doc=>{
				let token = doc.data().token;
				let message = {
					notification:{
						subtitle:"Hmmm",
						body:`${winkerName} has made a bold move.`
					},
					data:{
						message:`${winkerName} has made a bold move.`
					}
				}

				return messaging
				.sendToDevice(token,message)
				.then(res=>{
					console.log(res)
					return null
				})
				.catch((err)=>{
					console.log(err)
					return null}
					)

			})
			.catch((err)=>{
				console.log(err)
				return null
			})
		})
