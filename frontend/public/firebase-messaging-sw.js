// ✅ Use compat scripts for service workers (v8-style)
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

// ✅ Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyBWzE7vyM3BAyQZS691UKl7nMK2shu2NlU",
  projectId: "cams-64e5f",
  messagingSenderId: "678170868349",
  appId: "1:678170868349:web:4f38962c1f1ec9d8530f14",
});

// ✅ Initialize messaging
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
  });
});
