import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

const firebaseConfig = {
  apiKey: 'xxxxxxxx',
  authDomain: 'bit-of-gaia.firebaseapp.com',
  databaseURL: 'https://bit-of-gaia-default-rtdb.firebaseio.com',
  projectId: 'bit-of-gaia',
  storageBucket: 'bit-of-gaia.appspot.com',
  messagingSenderId: '895229666496',
  appId: 'xxxxxxxx'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  loggedInAs = '';

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private ngZone: NgZone, public router: Router) {
    // Init & do login
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.isLoggedIn = true;
        this.loggedInAs = user.email;
        console.log(`logged in ${user.email}`);
      } else {
        // User is signed out.
        this.isLoggedIn = false;
        this.loggedInAs = '';
        console.log('user signed out');
        this.ngZone.run(() => this.router.navigateByUrl('/')).then();
      }
    });
  }

  logout(): void {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      this.isLoggedIn = false;
    }).catch((error) => {
      // An error happened.
    });
  }
}
