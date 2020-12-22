/*!

=========================================================
* Paper Kit React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

// styles
import "assets/css/bootstrap.min.css";
import "assets/scss/paper-kit.scss?v=1.2.0";
import "assets/demo/demo.css?v=1.2.0";
// pages
import Main from "./Main";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import sr from 'date-fns/locale/sr-Latn';
import { setDefaultLocale, registerLocale } from "react-datepicker";


registerLocale('sr', sr)
setDefaultLocale("sr");

var firebaseConfig = {
  apiKey: "AIzaSyDpbrvx5fqGrLVFAW1APXi7UT3z9y95xdc",
  authDomain: "donosimo015-partner.firebaseapp.com",
  databaseURL: "https://donosimo015-partner.firebaseio.com",
  projectId: "donosimo015-partner",
  storageBucket: "donosimo015-partner.appspot.com",
  messagingSenderId: "451715437130",
  appId: "1:451715437130:web:8b20c21b504cf09fcb0cb3",
  measurementId: "G-M9RFQ07BP8"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().languageCode = 'rs';


firebase.auth().onAuthStateChanged(() => {
  if (firebase.auth().currentUser != null) {
    firebase.auth().currentUser.getIdToken(true)
      .then((idToken) => {
        localStorage.setItem("token", idToken);

      }).catch(() => {}).finally(() => {
        ReactDOM.render( <
          Main / > ,
          document.getElementById("root")
        );
      })
  } else {
    localStorage.removeItem("token");
    ReactDOM.render( <
      Main / > ,
      document.getElementById("root")
    );
  }

});