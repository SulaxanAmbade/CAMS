import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWzE7vyM3BAyQZS691UKl7nMK2shu2NlU",
  authDomain: "cams-64e5f.firebaseapp.com",
  projectId: "cams-64e5f",
  storageBucket: "cams-64e5f.firebasestorage.app",
  messagingSenderId: "678170868349",
  appId: "1:678170868349:web:4f38962c1f1ec9d8530f14",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BFD7ioB2GO_NxxI2tLPyD45l_In3UEdl4NbgiuMr_tEkAVu5f-_vECHv3BB1JLTx9DMMe_FP1p0n-LPHrJuISCY", // Only the public key
    });
    return token;
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
