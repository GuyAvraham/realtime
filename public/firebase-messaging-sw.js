// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
import firebase from 'firebase';

importScripts('https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.2/firebase-messaging.js');

// firebase.initializeApp({
//   messagingSenderId: '28759615294',
// });

var messaging = firebase.messaging();
const vKeyPublic = 'BDq3w_8x0D3hY4kY29OqwKv85Ioh1cxUjqbCaf1f6rmeQblCln1MLHhC7rQIOhwTfXrbfknDHAq7C8jfMSPe3Dg';
messaging.usePublicVapidKey(vKeyPublic);


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]

// todo doenst work
self.addEventListener('notificationclick', (event) => {
  console.log('*** notification clicked')
  if (event.action) {
    clients.openWindow(event.action);
  }
  event.notification.close();
});