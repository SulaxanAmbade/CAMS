import { notification } from "antd";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWzE7vyM3BAyQZS691UKl7nMK2shu2NlU",
  authDomain: "cams-64e5f.firebaseapp.com",
  projectId: "cams-64e5f",
  storageBucket: "cams-64e5f.appspot.com", // Corrected ".app" to ".com"
  messagingSenderId: "678170868349",
  appId: "1:678170868349:web:4f38962c1f1ec9d8530f14",
};

const app = initializeApp(firebaseConfig);

let messaging = null;

// Check if messaging is supported and initialize if so
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.warn("Firebase messaging is not supported in this browser.");
  }
});

export const getFcmToken = async () => {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BFD7ioB2GO_NxxI2tLPyD45l_In3UEdl4NbgiuMr_tEkAVu5f-_vECHv3BB1JLTx9DMMe_FP1p0n-LPHrJuISCY",
    });
    return token;
  } catch (error) {
    notification.error({ message: "Fcm Error" });
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
