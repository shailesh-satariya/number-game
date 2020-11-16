import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig: Record<string, string> = {
    apiKey: "AIzaSyBgDwlsYbhqQlpKZ-4xSOXAMRzvVRoo2TQ",
    authDomain: "number-game-4c341.firebaseapp.com",
    databaseURL: "https://number-game-4c341.firebaseio.com",
    projectId: "number-game-4c341",
    storageBucket: "number-game-4c341.appspot.com",
    messagingSenderId: "479231468816",
    appId: "1:479231468816:web:279cceab92ef91a231f195",
    measurementId: "G-RP8HM4WDTK"
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.database();
export const gameRef = db.ref('game');
export const infoRef = db.ref('.info/connected');
export const playerRef = db.ref('player');


export default firebase;
