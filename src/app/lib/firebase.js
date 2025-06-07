/********************************************
 * lib/firebase.js 
*********************************************/

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// This is public as the documentation says this should be ok
const firebaseConfig = {

    apiKey: "AIzaSyBz7AtIbpExBf_e7n-_BR52eajBeZsd6ZM",

    authDomain: "chickendatabase-aee3a.firebaseapp.com",

    projectId: "chickendatabase-aee3a",

    storageBucket: "chickendatabase-aee3a.firebasestorage.app",

    messagingSenderId: "434767814286",

    appId: "1:434767814286:web:596782c3f18e94a53df3df",

    measurementId: "G-SB3KW5LFRY"

};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
