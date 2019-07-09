const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const messaging = admin.messaging();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//firestore triggers, docs
//https://firebase.google.com/docs/functions/firestore-events

exports.sendWinkedNotification = functions.firestore
  .document("winks/{docId}")
  .onUpdate((change, context) => {
    console.log("[changed]");
    const doc = change.after.data();
    console.log(doc);
    console.log(change.after);
    console.log(context);

    //send a push notification
  });
