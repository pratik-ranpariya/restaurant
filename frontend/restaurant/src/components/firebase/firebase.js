import firebase from 'firebase'
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB9ir88TBdApxuWJJJp7TWCAVs2VVS6LYM",
  authDomain: "scannmenu-a263c.firebaseapp.com",
  projectId: "scannmenu-a263c",
  storageBucket: "scannmenu-a263c.appspot.com",
  messagingSenderId: "205176802477",
  appId: "1:205176802477:web:2f5dfd006819d0fad20a24",
  measurementId: "G-TDRL5NDNGB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const getToken = (setTokenFound) => {
  return messaging.getToken({vapidKey: 'BHOPt8EPm3RuxwDZfbpCvaoezhS2GDmZ0bZf5FGJESbC2eqHTfE7R-Z11t5jN0QXroLhzMKE7KOtF8mW-4cbiHw'})
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});

