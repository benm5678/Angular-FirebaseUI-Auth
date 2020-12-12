import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

import { AuthService } from './../../auth/auth.service';

import 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

const providerMicrosoft = new firebase.auth.OAuthProvider('microsoft.com');

const uiConfig = {
  callbacks: {
    signInFailure(error): Promise<void> {
      console.log(`login failed: ${error}`);
      return Promise.resolve();
    },
    signInSuccessWithAuthResult(authResult, redirectUrl): boolean {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(`logged in as: ${authResult.user.email}`);
      return false;
    },
    uiShown(): void {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    providerMicrosoft.providerId,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  readonly ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

  constructor(public authService: AuthService, public router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {

    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Redirect the user
        console.log(`redirect logged in user to root page`);
        this.ngZone.run(() => this.router.navigateByUrl('/')).then();
      } else {
        console.log(`redirect logged out user to login page`);
        // User is signed out.
        this.ngZone.run(() => this.router.navigateByUrl('/login')).then(() => {
          console.log('show login UI');
          this.ui.start('#firebaseui-auth-container', uiConfig);
        });
      }
    });

  }
}
