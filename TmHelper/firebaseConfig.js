import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCui4iPW46wSGJ5TJGypBMlU2Y2ZYlbEjA", 
    authDomain: "rotodex-dc21c.firebaseapp.com", 
    projectId: "rotodex-dc21c", 
    storageBucket: "rotodex-dc21c.firebasestorage.app", 
    messagingSenderId: "883837524276", 
    appId: "1:883837524276:android:85ff1b8819f2517933ad61", 
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };