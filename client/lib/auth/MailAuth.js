import React from 'react';
import firebase from 'firebase';
import { Alert } from 'react-native';
import NavigationService from '../../services/NavigationService';

export default class MailAuth extends React.Component {

  static onSignInPress (email, password, callback)
  {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then( () => { NavigationService.navigate('Main'); } )
      .catch( (error) => {

        if(String(error).includes('email address is badly formatted'))
        {
          Alert.alert('Enter Error', 'Please enter your mail address correctly.');
        }
        else if(String(error).includes('password is invalid'))
        {
          Alert.alert('Enter Error', 'Please enter your password.');
        }
        else if(String(error).includes('A network error'))
        {
          Alert.alert('Connection Error', 'Please check your internet connection.');
        }
        else
        {
          console.log(' ------Unknown Error ------');
          Alert.alert('Unknown Error', error.message);
        }

        console.log('!! ERROR !! - onSignInPress() -> ', error.message);

      });
}

  // Bu kısımda kullanıcıdan profil resmi gibi değerler aldıktan sonra firebase kullanıcısı olarak eklememiz gerekiyor, SignUpNextScreen lazım bize.

  // Google ve Facebook üstünden gelen kullanıcılara da bu screen'i gösterip profilinde bulunan fotoğrafı değiştirip değiştirmek istemediği sorulabilir, nickname alınabilir.

  static onSignUpPress (email, password, passwordConfirm)
  {
    if ( password !== passwordConfirm )
    {
      Alert.alert('False Enter', 'Passwords do not match.');
    }
    else if(password.length < 6)
    {
      Alert.alert('False Enter', 'Please enter atleast 6 characters.');
    }
    else
    {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {

          Alert.alert("Account created.");
          NavigationService.navigate('Main');

        })
        .catch( (error) => {

          if(String(error).includes('A network error'))
          {
            Alert.alert('Connection Error', 'Please check your internet connection.');
          }
          else if(String(error).includes('email address is badly formatted'))
          {
            Alert.alert('Login Error', 'Please enter your mail address correctly.');
          }
          else
          {
            console.log(' ------Unknown Error ------');
            Alert.alert('Unknown Error', error.message);
          }

          console.log('!! ERROR !! - onSignUpPress() -> ', error.message);

        });
    }
}

  static onResetPasswordPress (email)
  {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => { Alert.alert('Password reset email has been sent.'); })
      .catch( (error) => {

        if(String(error).includes('email address is badly formatted'))
        {
          Alert.alert('Login Error', 'Please enter your mail address correctly.');
        }
        else if(String(error).includes('A network error'))
        {
          Alert.alert('Connection Error', 'Please check your internet connection.');
        }
        else
        {
          console.log(' ------Unknown Error ------');
          Alert.alert(error.message);
        }

        console.log('!! ERROR !! - onResetPasswordPress() -> ', error.message);

      });
  }
}
