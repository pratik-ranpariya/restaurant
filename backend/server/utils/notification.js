var admin = require("firebase-admin")
var serviceAccount = require("../firebase_sdk/scannmenu-a263c-firebase-adminsdk-7yygw-9139157ffc.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://squad-xyz-61441-default-rtdb.europe-west1.firebasedatabase.app"
})

const FirebaseNotification = (fcmToken, title, /*data*/) => {
        fcmToken = fcmToken
//	title = 'call from api'
	var payload = {
        notification: {
            color: '#ff0000',
            title: title
        },
        // data
    }
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    }
    // console.log(payload)
    if(fcmToken){
        admin.messaging().sendToDevice(fcmToken, payload, options)
        .then((response) => {
            return 'success';
        })
        .catch((error) => {
            console.log('error', error)
        })
    }
}

module.exports = FirebaseNotification
