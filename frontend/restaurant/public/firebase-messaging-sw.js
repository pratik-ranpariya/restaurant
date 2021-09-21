importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

