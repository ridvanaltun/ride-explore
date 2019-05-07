import React from 'react';
import { Alert } from 'react-native';
import { Facebook } from 'expo';
import firebase from 'firebase';
import { facebookAuthConfig } from '../../configs/facebook';
import NavigationService from '../../services/NavigationService';

export default class FacebookAuth extends React.Component{

  static async signInWithFacebookAsync() {
    try
    {
      const { type, token, expires, permissions, declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync(
            facebookAuthConfig.appId,
            { permissions: ['public_profile', 'email'],}
      );

      if (type === 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token);

        // Sign in with credential from the Facebook user.
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .catch((error) => {
            console.log(error)
          });

        // Get the user's name using Facebook's Graph API
        ///const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        ///Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);

        // console.log(await response.json());

        NavigationService.navigate('Main');
      }
      else
      {
        // type === 'cancel'
      }
    }
    catch( { message } )
    {
      if(message == 'net::ERR_SSL_PROTOCOL_ERROR')
      {
        Alert.alert('Connection Problem', 'Please check your internet connection.');
      }
      else
      {
        Alert.alert('Facebook Login Error', message);
      }
    }
  }
}
