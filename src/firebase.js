import firebase from 'firebase/app';
import 'firebase/messaging';

let messaging;

let registerService = function () {
  if ('serviceWorker' in navigator) {
    console.log('*** service worker supported')
    window.addEventListener('load', async () => {
      console.log('*** on load event: register the service worker')
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        updateViaCache: 'none'
      });

      messaging.useServiceWorker(registration);
      console.log(1, '*** 1 done')

      // messaging.onMessage((payload) => {
      //   const title = payload.notification.title;
      //   const options = {
      //     body: payload.notification.body,
      //     icon: payload.notification.icon,
      //     actions: [
      //       {
      //         action: payload.fcmOptions.link,
      //         title: 'Book Appointment'
      //       }
      //     ]
      //   };
      //   return registration.showNotification(title, options);
      // });
    });
  }
};

export function init() {
  firebase.initializeApp({
    messagingSenderId: '28759615294',
  });

  messaging = firebase.messaging();
  const vKeyPublic = 'BDq3w_8x0D3hY4kY29OqwKv85Ioh1cxUjqbCaf1f6rmeQblCln1MLHhC7rQIOhwTfXrbfknDHAq7C8jfMSPe3Dg';
  messaging.usePublicVapidKey(vKeyPublic);

  // registerService(messaging);

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
  });

  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      resetUI();
      // [END_EXCLUDE]
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });

  resetUI();
}

function resetUI() {
  showToken('loading...');
  // [START get_token]
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      sendTokenToServer(currentToken);
      console.log('push enabled')
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      console.log(', \'*** \')updateUIForPushPermissionRequired')
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  // [END get_token]
}



function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
      'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

export function requestPermission() {
  console.log('Requesting permission...');
  // [START request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission,
      // it should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
  // [END request_permission]
}

function showToken(currentToken) {
  console.log(currentToken, '*** currentToken')
}