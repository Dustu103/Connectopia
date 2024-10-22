// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRD9JqmWI3-BsVP3VIrMve1bP_MYN0KR4",
  authDomain: "chatapp-fdf1c.firebaseapp.com",
  projectId: "chatapp-fdf1c",
  storageBucket: "chatapp-fdf1c.appspot.com",
  messagingSenderId: "456663838687",
  appId: "1:456663838687:web:4ee8912f066cbfd2b9de6a",
  measurementId: "G-7YEW39DMXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;